/* eslint-disable max-lines-per-function */
import * as _ from 'lodash';
import { Response } from 'express';
import { Transaction } from 'sequelize';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from './base.controller';
import { BaseModelService } from './base.service';
import { BaseModel } from './base.model';
import { SuccessResponseDto } from './base.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  TransactionInterceptor,
  TransactionParam,
} from '../interceptors/transaction.interceptor';
import { ActiveStates } from '../constants/active_states.enum';
import { Op } from 'sequelize';

export function BaseCrudController<
  TFilter,
  TListResponse,
  TDetailResponse,
  TCreatePayload,
  TUpdatePayload,
>(options: {
  modelName: string;
  filterType: TFilter;
  listResponseType: TListResponse;
  detailResponseType: TDetailResponse;
  createPayloadType: TCreatePayload;
  updatePayloadType: TUpdatePayload;
}) {
  const {
    modelName,
    filterType,
    listResponseType,
    detailResponseType,
    createPayloadType,
    updatePayloadType,
  } = options;

  @Controller('/v1/' + _.kebabCase(modelName))
  @ApiTags(modelName)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  class BaseCrudController extends BaseController {
    service: BaseModelService<BaseModel>;

    @Get()
    @ApiOperation({ summary: 'Get list ' + modelName })
    @ApiQuery({ type: () => filterType })
    @ApiOkResponse({ type: () => listResponseType })
    async getList(@Res() res: Response, @Query() query: any) {
      const {
        offset,
        limit,
        sort_by,
        sort_order,
        activate_state,
        ...condition
      } = query;

      let include_deleted = true;
      if (activate_state === ActiveStates.Active) include_deleted = false;
      else if (activate_state === ActiveStates.Deleted)
        condition.deleted_at = { [Op.ne]: null };

      const data = await this.service.findList(condition, {
        limit,
        offset,
        sort_by,
        sort_order,
        include_deleted,
      });
      return this.pagingResponse(res, data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get detail ' + modelName })
    @ApiOkResponse({ type: () => detailResponseType })
    async getDetail(@Res() res: Response, @Param('id') id: string) {
      const data = await this.service.findById(id, {
        include_deleted: true,
      });
      return this.successResponse(res, data);
    }

    @Post()
    @ApiOperation({ summary: 'Create ' + modelName })
    @ApiBody({ type: () => createPayloadType })
    @ApiOkResponse({ type: () => detailResponseType })
    @UseInterceptors(TransactionInterceptor)
    async create(
      @Res() res: Response,
      @Body() payload: TCreatePayload,
      @TransactionParam() transaction: Transaction,
    ) {
      const result = await this.service.create(payload, { transaction });
      return this.successResponse(res, result);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update ' + modelName })
    @ApiBody({ type: () => updatePayloadType })
    @ApiOkResponse({ type: () => detailResponseType })
    @UseInterceptors(TransactionInterceptor)
    async update(
      @Res() res: Response,
      @Param('id') id: string,
      @Body() payload: TUpdatePayload,
      @TransactionParam() transaction: Transaction,
    ) {
      const result = await this.service.update(id, payload, { transaction });
      return this.successResponse(res, result);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete ' + modelName })
    @ApiOkResponse({ type: SuccessResponseDto })
    @UseInterceptors(TransactionInterceptor)
    async delete(
      @Res() res: Response,
      @Param('id') id: string,
      @TransactionParam() transaction: Transaction,
    ) {
      await this.service.delete(id, { transaction });
      return this.successResponse(res);
    }

    @Put(':id/restore')
    @ApiOperation({ summary: 'Recover ' + modelName })
    @ApiOkResponse({ type: SuccessResponseDto })
    @UseInterceptors(TransactionInterceptor)
    async restore(
      @Res() res: Response,
      @Param('id') id: string,
      @TransactionParam() transaction: Transaction,
    ) {
      await this.service.restore(id, { transaction });
      return this.successResponse(res);
    }
  }

  return BaseCrudController;
}
