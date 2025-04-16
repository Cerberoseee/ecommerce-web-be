import { Module, forwardRef } from '@nestjs/common';
import { AiController } from './ai.controller';
import { MessageModule } from '../message/message.module';
import { ChatSessionModule } from '../chat_session/chat_session.module';
import { OpenaiCredentialModule } from '../openai_credential/openai_credential.module';
import { CurlModule } from '../curl/curl.module';
import { CustomerModule } from '../customer/customer.module';
import { BullModule } from '@nestjs/bull';
import { LangchainModule } from '../langchain/langchain.module';
import { BotModule } from '../bot/bot.module';
import { AIHandlerConversationService } from './handler/conversation.service';
import { AIHandlerChatService } from './handler/chat.service';
import { QueueName } from '../processor/processor.enum';
import { BotActiveTrackingModule } from '../bot_active_tracking/bot_active_tracking.module';
import { TagModule } from '../tag/tag.module';
import { AppGatewayModule } from '../gateway/gateway.module';
import { SocketEventModule } from '../socket_event/socket_event.module';
import { TagSessionRelationModule } from '../tag_session_relation/tag_session_relation.module';
import { TagTicketRelationModule } from '../tag_ticket_relation/tag_ticket_relation.module';
import { TagTriggerFlowModule } from '../message_flow/tag_trigger_flow/tag_trigger_flow.module';

@Module({
  imports: [
    forwardRef(() => MessageModule),
    forwardRef(() => ChatSessionModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => BotModule),
    forwardRef(() => SocketEventModule),
    BotActiveTrackingModule,
    LangchainModule,
    OpenaiCredentialModule,
    CurlModule,
    TagModule,
    TagSessionRelationModule,
    TagTicketRelationModule,
    TagTriggerFlowModule,

    forwardRef(() => AppGatewayModule),

    BullModule.registerQueue({
      name: QueueName.AI,
    }),
  ],
  providers: [AIHandlerConversationService, AIHandlerChatService],
  controllers: [AiController],
  exports: [AIHandlerConversationService, AIHandlerChatService],
})
export class AIModule {}
