import { Inject, Injectable } from '@nestjs/common';
import { GetAnswerForMessageDto } from 'src/modules/message/message.dto';
import { VendorMessageEnum } from 'src/modules/message/message.enum';
import { CurlService } from '../../curl/curl.service';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceKeys } from 'src/common';

@Injectable()
export class AIHandlerChatService {
  private coreAIUrl: string;

  constructor(
    @Inject(CurlService)
    private curlService: CurlService,
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {
    this.coreAIUrl = this.configService.get<string>(
      ConfigServiceKeys.CORE_CHAT_AI_URL,
    );
  }

  // Process to get term for search
  async processGetAnserForConversation(
    payload: GetAnswerForMessageDto,
  ): Promise<{
    answer: string;
    have_enough_information_for_reply: string;
    search_term: string;
  }> {
    try {
      let result: any;
      const payloadSend = {
        company_name: payload.bot?.business_name,
        bot_name: payload.bot.name,
        current_vocative: payload.sender?.vocative,
        current_language_using: payload.sender?.language_using,
        question: payload.question,
        session_id: payload?.session_id,
        bot_id: payload.bot.id,
        bot: payload.bot,
        workspace: payload.workspace,
        setting_reply_language: payload.bot?.reply_language,
        actions: payload?.actions,
        block: payload?.block,
        sender: payload.sender,
        ticket_id: payload?.ticket_id,
        type: payload.type,
        block_id: payload.block_id,
        images: payload?.images || [],
        videos: payload?.videos || [],
        efficiency: payload?.efficiency,
        customer_id: payload.customer_id,
        schema_information: payload?.schema_information,
        database_explain: payload?.database_explain,
        is_use_dynamic_data: payload.is_use_dynamic_data,
        is_suggestion: payload.is_suggestion,
        vendor_message: payload?.vendor_message || VendorMessageEnum.DEFAULT,
        reply_unknown: payload?.reply_unknown,
        type_reply_unknown: payload?.type_reply_unknown,
        custom_prompt: payload?.custom_prompt,
        model_selected: payload.model_selected,
        type_socket: payload?.type_socket,
        suggestion_id: payload?.suggestion_id,
        api_key: payload?.api_key,
        is_using_gpt_knowledge: payload.is_using_gpt_knowledge,
        allow_emoji: payload.allow_emoji,
        local_id: payload?.local_id,
        metadata: payload?.metadata,
        model_name: payload?.model_name,
        serving_platform: payload?.serving_platform,
        is_custom_key: payload?.is_custom_key,
      };
      const resultOfProcessGetAnswerForConversation =
        await this.curlService.post({
          url: `${this.coreAIUrl}/messages/process-chat-of-customer`,
          data: payloadSend,
        });
      if (
        resultOfProcessGetAnswerForConversation &&
        resultOfProcessGetAnswerForConversation?.data
      ) {
        result = resultOfProcessGetAnswerForConversation.data;
      }
      return result;
    } catch (error) {
      return null;
      // throw error;
    }
  }
}
