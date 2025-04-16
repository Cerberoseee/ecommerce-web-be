import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeExtractConversation } from './ai.enum';

export class ExtractKnowledgeFromConversationDto {
  @IsString()
  customer_id?: string;

  @IsString()
  bot_id?: string;

  @IsString()
  @IsOptional()
  session_id?: string;

  @IsString()
  @IsOptional()
  ticket_id?: string;

  @IsEnum(TypeExtractConversation)
  @IsOptional()
  type?: TypeExtractConversation = TypeExtractConversation.IMMEDIATELY;

  @IsOptional()
  @IsString()
  user_id?: string;
}
