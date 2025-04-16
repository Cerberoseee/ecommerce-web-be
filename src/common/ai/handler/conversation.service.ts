import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ExtractKnowledgeFromConversationDto } from '../ai.dto';
import { MessageService } from '../../message/message.service';
import { ChatSessionService } from '../../chat_session/chat_session.service';
import { CustomerService } from '../../customer/customer.service';
import { OpenaiCredentialService } from '../../openai_credential/openai_credential.service';
import { CurlService } from '../../curl/curl.service';
import { formatConversation } from '../../message/message.helpers';
import {
  ExtractConversationSource,
  MessageType,
} from '../../message/message.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TypeExtractConversation, TypeTriggerSummary } from '../ai.enum';
import { StatusExtractKnowledge } from '../../customer/customer.dto';
import { CustomerModel, MessageModel } from 'src/models';
import { LangchainService } from '../../langchain/langchain.service';
import { BotService } from '../../bot/bot.service';
import { JobInQueue, QueueName } from '../../processor/processor.enum';
import { botIdsNeedToBeTracked } from 'src/modules/bot_active_tracking/bot_active_tracking.const';
import { BotActiveTrackingService } from 'src/modules/bot_active_tracking/bot_active_tracking.service';
import { BotActiveTrackingEnum } from 'src/modules/bot_active_tracking/bot_active_tracking.enum';
import { TagService } from 'src/modules/tag/tag.service';
import { AppGateway } from 'src/modules/gateway/gateway.service';
import { SendEventName } from 'src/modules/gateway/gateway.enum';
import { Op } from 'sequelize';
import { LaunchDarklyService } from '../../launchdarkly/launchdarkly.service';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceKeys } from 'src/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { LaunchDarklyFlagKeys } from 'src/modules/launchdarkly/launchdarkly.enum';
import { SocketEventService } from 'src/modules/socket_event/socket_event.service';
import { TagSessionRelationService } from 'src/modules/tag_session_relation/tag_session_relation.service';
import { TagTicketRelationService } from 'src/modules/tag_ticket_relation/tag_ticket_relation.service';
import { TagTriggerFlowService } from 'src/modules/message_flow/tag_trigger_flow/tag_trigger_flow.service';
import { uniqBy } from 'lodash';
import { TagName } from 'src/modules/tag/tag.dto';

@Injectable()
export class AIHandlerConversationService {
  private loaderServiceUrl: string;

  constructor(
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    @Inject(forwardRef(() => ChatSessionService))
    private chatSessionService: ChatSessionService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
    @Inject(forwardRef(() => BotService))
    private botService: BotService,
    @Inject(forwardRef(() => OpenaiCredentialService))
    private openaiCredentialService: OpenaiCredentialService,
    @Inject(CurlService)
    private curlService: CurlService,
    @Inject(forwardRef(() => LangchainService))
    private langchainService: LangchainService,
    @Inject(forwardRef(() => SocketEventService))
    private socketEventService: SocketEventService,
    @Inject(BotActiveTrackingService)
    private botActiveTrackingService: BotActiveTrackingService,
    @Inject(forwardRef(() => TagService))
    private tagService: TagService,
    @Inject(forwardRef(() => AppGateway))
    private appGatewayService: AppGateway,
    @Inject(forwardRef(() => TagSessionRelationService))
    private tagSessionRelationService: TagSessionRelationService,
    @Inject(forwardRef(() => TagTicketRelationService))
    private tagTicketRelationService: TagTicketRelationService,
    @Inject(forwardRef(() => TagTriggerFlowService))
    private tagTriggerFlowService: TagTriggerFlowService,

    @InjectQueue(QueueName.AI)
    private aiProcessor: Queue,
    @Inject(LaunchDarklyService)
    private launchDarklyService: LaunchDarklyService,
    @Inject(ConfigService)
    private configService: ConfigService,
    @InjectPinoLogger(AIHandlerConversationService.name)
    private logger: PinoLogger,
  ) {
    this.loaderServiceUrl = this.configService.get<string>(
      ConfigServiceKeys.LOADER_SERVICE_URL,
    );
  }

  // Functions about extract knowledge from conversation
  async processExtractConversation(
    payload: ExtractKnowledgeFromConversationDto,
    user_id = null,
  ) {
    try {
      const data = {
        ...payload,
        user_id,
      };
      let customer;
      if (payload.customer_id) {
        customer = await this.customerService.findInCache(payload.customer_id);
        if (customer.bot_id) {
          const bot = await this.botService.findInCache(customer.bot_id);
          if (botIdsNeedToBeTracked.includes(payload.bot_id)) {
            this.botActiveTrackingService.count_action({
              bot_id: payload.bot_id,
              workspace_id: bot.workspace_id,
              action_name: BotActiveTrackingEnum.LEARNING_CONVERSATION,
              total_add_more: 1,
            });
          }
          const workspaceSetting =
            await this.botService.getWorkspaceSettingByBotIdOrWorkspaceId({
              workspace_id: bot.workspace_id,
            });
          const isWorkspaceUsageReportEnabled =
            await this.launchDarklyService.getFlag(
              LaunchDarklyFlagKeys.WORKSPACE_USAGE_REPORT,
            );
          if (
            bot.is_max_credit_usage &&
            !workspaceSetting?.ai_api_key_id &&
            isWorkspaceUsageReportEnabled
          ) {
            throw new BadRequestException(
              'Cannot use this feature due to credit limitation',
            );
          }
        }
      }

      if (payload.type == TypeExtractConversation.IMMEDIATELY) {
        this.extractKnowledgeFromConversation(data).catch((err) => {
          this.logger.error(err, 'extractKnowledgeFromConversation');
        });
      } else {
        if (
          customer &&
          customer.extract_knowledge_status != StatusExtractKnowledge.LEARNING
        ) {
          this.customerService.update(customer.id, {
            extract_knowledge_status: StatusExtractKnowledge.LEARNING,
          });
          this.aiProcessor.add(
            JobInQueue[QueueName.AI].EXTRACT_CONVERSATION,
            data,
            {
              delay: 60 * 60 * 1000,
              timeout: 1000 * 60 * 5,
              attempts: 1,
              removeOnFail: true,
              removeOnComplete: true,
            },
          );
        }
      }
      return 'finish';
    } catch (error) {
      throw error;
    }
  }

  async extractKnowledgeFromConversation(
    payload: ExtractKnowledgeFromConversationDto,
    customer?: CustomerModel,
  ) {
    try {
      const lastExtractTime = new Date();
      if (!customer) {
        customer = await this.customerService.findOne(
          {
            id: payload.customer_id,
          },
          true,
        );
      }
      const condition = {
        last_extracted_knowledge: customer.last_extract_data_conversation,
        order: 'asc',
        limit: 100,
      };
      if (payload?.session_id) {
        condition['bot_id'] = payload.bot_id;
        condition['session_id'] = payload.session_id;
      }
      if (payload?.ticket_id) {
        const session = await this.chatSessionService.findAvailableConversation(
          {
            ticket_id: payload.ticket_id,
            bot_id: payload?.bot_id,
          },
        );
        condition['session_id'] = session.id;
      }
      const messages = await this.messageService.findAll(condition);
      const { context } = formatConversation(messages);

      const apiKeyProvider = await this.openaiCredentialService.detectKeyUsing(
        {
          bot_id: payload.bot_id,
        },
        false,
      );

      const data = {
        context: context,
        bot_id: payload.bot_id,
        last_extract_time: lastExtractTime,
        customer_id: payload.customer_id,
        user_id: payload.user_id,
        ticket_id: payload?.ticket_id,
        api_key: apiKeyProvider.api_key,
        serving_platform: apiKeyProvider.serving_platform,
        model_name: apiKeyProvider.model_name,
        is_custom_key: apiKeyProvider.is_custom_key,
        source: ExtractConversationSource.LIVE_CHAT,
      };

      this.curlService
        .post({
          url: `${this.loaderServiceUrl}/bot-data/knowledge/from-conversation`,
          data,
        })
        .catch((err) => {
          this.logger.error(err, 'Curl error');
        });
    } catch (error) {
      this.logger.error({ error }, 'error extract knowledge');
      throw error;
    }
  }

  // Summary Conversation
  async summaryConversation(
    customer_id: string | null,
    session_id: string | null,
    type_trigger: TypeTriggerSummary,
    customer?: CustomerModel,
  ) {
    try {
      let result = {};
      let type;
      let session;

      if (customer_id) {
        session = await this.chatSessionService.findAvailableConversation({
          customer_id,
          not_assign_to_ticket: true,
        });
      }

      if (session_id) {
        session = await this.chatSessionService.findOne({
          id: session_id,
        });
      }

      if (!session) {
        return;
      }

      if (!customer) {
        customer = await this.customerService.findOne(
          {
            id: session.from_user_id,
          },
          true,
        );
      }

      const bot = await this.botService.findById(session.bot_id);
      const workspaceSetting =
        await this.botService.getWorkspaceSettingByBotIdOrWorkspaceId({
          workspace_id: bot.workspace_id,
        });
      const isWorkspaceUsageReportEnabled =
        await this.launchDarklyService.getFlag(
          LaunchDarklyFlagKeys.WORKSPACE_USAGE_REPORT,
        );
      if (
        bot.is_max_credit_usage &&
        !workspaceSetting?.ai_api_key_id &&
        isWorkspaceUsageReportEnabled
      ) {
        throw new BadRequestException(
          'Cannot use this feature due to credit limitation',
        );
      }

      const condition = {
        order: 'asc',
        session_id: session.id,
        type: MessageType.TEXT,
        limit: 100,
      };

      if (type_trigger == TypeTriggerSummary.SUMMARY) {
        condition['last_summary'] = customer.last_summary;
        await this.customerService.checkSummaryLimitForCustomer({
          customer,
        });
        await this.customerService.justUpdate(customer.id, {
          last_summary: Date.now() as any,
        });
      } else {
        condition['last_recap'] = customer.last_recap;
        await this.customerService.justUpdate(customer.id, {
          last_recap: Date.now() as any,
        });
      }

      const messages = await this.messageService.findAll(condition);
      let content = '';
      if (messages && messages.length == 0) {
        content = await this.langchainService.translateContent({
          content:
            'AI doesn’t have enough information to summarize this conversation, it has already been summarized last time.',
          target_language:
            bot?.reply_language || session?.reply_language || customer?.language_using || 'English',
          bot_id: session.bot_id,
        });
        type = MessageType.SUMMARY_ERROR;
      } else {
        content = await this.getSummary(messages);
        type = MessageType.SUMMARY;
      }

      if (type_trigger == TypeTriggerSummary.SUMMARY) {
        const message = await this.messageService.justCreateMessage({
          content,
          session_id: session.id,
          receiver_id: customer.id,
          type,
          bot_id: session.bot_id,
        });
        this.socketEventService.sendSocketWhenHaveNewMessage({
          message_id: message.id,
          session_id: message?.session_id,
          workspace_id: customer?.workspace_id,
          customer_id: customer.id,
        });
        const bot = await this.botService.findById(session.bot_id);
        result = {
          ...message?.dataValues,
          bot,
        };
      }

      return {
        ...result,
        summary: content,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSummary(messages: MessageModel[]) {
    try {
      const { context } = formatConversation(messages);

      const content = await this.langchainService.summaryContentConversation(
        context,
      );
      return content;
    } catch (error) {
      throw error;
    }
  }

  async getGeneratedTag(
    messages: MessageModel[],
    tags: { tag_id: string; name: string; description: string }[],
    workspace_id: string,
    bot_id?: string,
  ) {
    try {
      const { context } = formatConversation(messages);

      const content = await this.langchainService.generateCustomerTag(
        context,
        tags,
        workspace_id,
        bot_id,
      );

      return content;
    } catch (error) {
      this.logger.error({ error }, 'error getGeneratedTag');

      throw error;
    }
  }

  // Generate customer tag
  async generateCustomerTag(
    customer_id: string | null,
    session_id: string | null,
    options?: {
      currentBlockId?: string;
      nextBlockId?: string;
      ticket_id?: string;
      bot_id?: string;
    },
  ) {
    try {
      const result = {};
      let customer, session;

      if (customer_id) {
        const sessionCondition: any = {
          customer_id,
        };
        if (options?.ticket_id) {
          sessionCondition['ticket_id'] = options?.ticket_id;
        } else {
          sessionCondition['not_assign_to_ticket'] = true;
        }

        const res = await Promise.all([
          this.chatSessionService.findAvailableConversation(sessionCondition),
          this.customerService.findOne(
            {
              id: customer_id,
            },
            true,
          ),
        ]);
        session = res[0];
        customer = res[1];

        if (!customer?.bot_id && !options?.bot_id) {
          throw new BadRequestException('Bot info is missed');
        }
      } else {
        session = await this.chatSessionService.findOne({ id: session_id });
        customer = await this.customerService.findOne(
          { id: session?.from_user_id },
          true,
        );
        if (!customer?.bot_id && !options?.bot_id) {
          throw new BadRequestException('Bot info is missed');
        }
      }

      const bot = await this.botService.findById(
        customer?.bot_id || options?.bot_id || '',
      );

      const builtPayloadForQueueAutoTagJob = {
        customer_id: customer.id,
        messages: [],
        workspace_id: bot?.workspace_id,
        workspace: bot?.workspace,
        tags: [],
        session_id: session?.id,
        current_block_id: options?.currentBlockId,
        next_block_id: options?.nextBlockId,
        bot_id: bot?.id,
        ticket_id: options?.ticket_id,
      };

      if (!session || customer?.is_generating_tag) {
        if (options?.currentBlockId) {
          this.generateCustomerTagJob(builtPayloadForQueueAutoTagJob);
        }
        if (!session) {
          return;
        }

        // throw new BadRequestException('Conversation is generating tags');
        this.logger.error('Conversation is generating tags');
      }

      const workspaceSetting =
        await this.botService.getWorkspaceSettingByBotIdOrWorkspaceId({
          workspace_id: bot.workspace_id,
        });
      const isWorkspaceUsageReportEnabled =
        await this.launchDarklyService.getFlag(
          LaunchDarklyFlagKeys.WORKSPACE_USAGE_REPORT,
        );
      if (
        bot.is_max_credit_usage &&
        !workspaceSetting?.ai_api_key_id &&
        isWorkspaceUsageReportEnabled
      ) {
        throw new BadRequestException(
          'Cannot use this feature due to credit limitation',
        );
      }

      const condition = {
        order: 'asc',
        session_id: session.id,
        type: MessageType.TEXT,
        limit: 100,
      };

      const messages = await this.messageService.findAll(condition);

      if (messages && messages.length == 0) {
        this.generateCustomerTagJob(builtPayloadForQueueAutoTagJob);
      } else {
        const tags = await this.tagService.findAll({
          workspace_id: bot?.workspace_id,
          parent_id: {
            [Op.is]: null,
          },
          name: {
            [Op.notILike]: TagName.AUTO_CLOSE,
          },
        });
        if (!tags?.length) {
          throw new NotFoundException('Tags not found');
        }

        this.generateCustomerTagJob({
          ...builtPayloadForQueueAutoTagJob,
          customer_id: customer.id,
          messages,
          workspace_id: bot?.workspace_id,
          workspace: bot?.workspace,
          tags: tags?.map((item) => ({
            id: item?.id,
            name: item?.name,
            description: item?.descriptions || item?.name,
            sub_tags: item?.sub_tags?.map((subTag) => ({
              id: subTag?.id,
              name: subTag?.name,
              description: subTag?.descriptions || subTag?.name,
            })),
          })),
          session_id: session.id,
          current_block_id: options?.currentBlockId,
          next_block_id: options?.nextBlockId,
          bot_id: bot?.id,
        });

        await this.customerService.update(customer.id, {
          is_generating_tag: true,
        });

        this.appGatewayService.server
          .to(bot?.workspace_id)
          .emit(SendEventName.GENERATE_CUSTOMER_TAG, {
            status: 'processing',
            session_id: session?.id,
          });
      }

      return {
        ...result,
      };
    } catch (error) {
      throw error;
    }
  }

  async generateCustomerTagJob(payload: any) {
    const { workspace_id, tags, messages, customer_id, session_id, ticket_id } =
      payload;

    try {
      if (!!session_id) {
        const tagsResult = await this.getGeneratedTag(
          messages,
          tags,
          workspace_id,
          payload?.bot_id,
        );
        let result = null;
        if (!!ticket_id) {
          result = await this.tagTicketRelationService.assignTagsToTicket(
            ticket_id,
            tagsResult,
          );
        } else {
          result = await this.tagSessionRelationService.assignTagsToSession(
            session_id,
            tagsResult,
          );
        }
        const { currentTags } = result || {};

        const currentTagsList = uniqBy(
          currentTags,
          (item: { id: string; name: string; parent_id: null }) => item.id,
        );

        if (!currentTagsList?.length) {
          this.appGatewayService.server
            .to(workspace_id)
            .emit(SendEventName.GENERATE_CUSTOMER_TAG, {
              status: 'failed',
              customer_id,
              session_id: session_id,
            });

          return;
        }

        await this.chatSessionService.justUpdate(session_id, {
          tag_ids: currentTagsList?.map((item) => item.id) || [],
        });

        let updatedTagRelations = [];
        if (!!ticket_id) {
          updatedTagRelations = await this.tagTicketRelationService.findAll({
            ticket_id,
          });
        } else {
          updatedTagRelations = await this.tagSessionRelationService.findAll({
            session_id,
          });
        }

        this.tagTriggerFlowService
          .checkTagsTrigger(
            currentTagsList?.map(
              (t: { id: string; name: string; parent_id: null }) => t.id,
            ),
            customer_id,
            session_id,
            ticket_id,
          )
          .catch((error) => {
            this.logger.error({ error }, 'error checkTagsTrigger');
          });

        this.appGatewayService.server
          .to(workspace_id)
          .emit(SendEventName.GENERATE_CUSTOMER_TAG, {
            customer_id,
            ticket_id,
            status: 'done',
            tag_list: updatedTagRelations?.map((tag) => tag?.tag),
            session_id: session_id,
          });
      }
    } catch (err) {
      this.appGatewayService.server
        .to(workspace_id)
        .emit(SendEventName.GENERATE_CUSTOMER_TAG, {
          status: 'failed',
          customer_id,
          session_id: session_id,
        });
    } finally {
      // turn of is_generating_tag in customer
      await this.customerService
        .update(customer_id, {
          is_generating_tag: false,
        })
        .catch((error) => {
          this.logger.error(
            { error },
            'turn off is_generating_tag in customer',
          );
        });
    }
  }
}
