import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { BaseController } from 'src/base.controller';
import { Result } from 'src/common/results/result';
import { ExtractKnowledgeFromConversationDto } from './ai.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TypeTriggerSummary } from './ai.enum';
import { AIHandlerConversationService } from './handler/conversation.service';
import { PermissionService } from '../permission/permission.service';
import {
  DefaultAdminModule,
  DefaultModulePermission,
} from '../default_workspace_role_permission/default_workspace_role_permission.enum';

@ApiTags('AI')
@Controller('/v1/ai')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class AiController extends BaseController {
  constructor(
    @Inject(AIHandlerConversationService)
    private aIHandlerConversationService: AIHandlerConversationService,
    @Inject(PermissionService)
    private permissionService: PermissionService,
  ) {
    super();
  }

  @Post('/knowledge/extract-from-conversation')
  @ApiOperation({ summary: 'Create bot' })
  async extractKnowledgeFromConversation(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @Body() payload: ExtractKnowledgeFromConversationDto,
  ) {
    try {
      const userId = request?.user?.id;
      await this.permissionService.validatePermission({
        user_id: userId,
        bot_id: payload.bot_id,
        permission_modules: [
          [
            DefaultAdminModule.CHAT_LEARN_FROM_CONVERSATION,
            DefaultModulePermission.MANAGE,
          ],
        ],
      });

      const data =
        await this.aIHandlerConversationService.processExtractConversation(
          payload,
          userId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/summary/:customer_id')
  @ApiOperation({ summary: 'Summary conversation' })
  async summaryConversation(
    @Res() response: express.Response,
    @Param('customer_id') customer_id: string,
  ) {
    try {
      const data = await this.aIHandlerConversationService.summaryConversation(
        customer_id,
        null,
        TypeTriggerSummary.SUMMARY,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/summary-by-session/:session_id')
  @ApiOperation({ summary: 'Summary conversation' })
  async summaryConversationBySession(
    @Res() response: express.Response,
    @Param('session_id') session_id: string,
  ) {
    try {
      const data = await this.aIHandlerConversationService.summaryConversation(
        null,
        session_id,
        TypeTriggerSummary.SUMMARY,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/tag-generate/:customer_id')
  @ApiOperation({ summary: 'Generate customer tag ' })
  async generateTagConversation(
    @Res() response: express.Response,
    @Param('customer_id') customer_id: string,
  ) {
    try {
      const data = await this.aIHandlerConversationService.generateCustomerTag(
        customer_id,
        null,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/tag-generate-by-session/:session_id')
  @ApiOperation({ summary: 'Generate customer tag ' })
  async generateTagConversationBySession(
    @Res() response: express.Response,
    @Param('session_id') session_id: string,
  ) {
    try {
      const data = await this.aIHandlerConversationService.generateCustomerTag(
        null,
        session_id,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
