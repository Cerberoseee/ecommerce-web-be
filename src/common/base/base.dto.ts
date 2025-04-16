/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ClassTransformer from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { HttpStatus, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ActiveStates } from '../constants/active_states.enum';

export class AppException extends Error {
  // @ApiHideProperty()
  @ApiProperty({
    description: 'mã trạng thái',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
    nullable: true,
    default: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode?: number;

  @ApiProperty({ description: 'mã lỗi', example: 'exception' })
  code: string;

  @ApiProperty({ description: 'thông báo lỗi' })
  message: string;

  @ApiProperty({ description: 'error data', nullable: true })
  data?: any;

  constructor(message: string, code?: string, statusCode?: number, data?: any) {
    super(message);
    this.code = code ?? 'exception';
    this.name = this.code;
    this.statusCode = statusCode ?? 500;
    this.data = data;
  }
}

export class ErrorResponse extends OmitType(AppException, [
  'name',
  'statusCode',
] as const) {}

export function ResponseType<T extends Type>(ClassDef: T) {
  class ResponseItemDto extends ClassDef {
    @ApiProperty({ type: 'string', format: 'uuid' })
    id: string;

    @ApiProperty({ description: 'created time' })
    created_at: Date;

    @ApiProperty({ description: 'updated time' })
    updated_at: Date;

    @ApiProperty({ description: 'deleted time', nullable: true })
    deleted_at?: Date;
  }

  return ResponseItemDto;
}

export class PagingFilterDto {
  @ClassTransformer.Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'number of skipped records',
    default: 0,
    minimum: 0,
  })
  offset?: number = 0;

  @ClassTransformer.Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  @ApiProperty({
    description: 'number of taken records',
    default: 10,
    minimum: 1,
    maximum: 1000,
  })
  limit?: number = 10;
}

export function AdminPagingFilterDto<T extends Type>(ModelDef: T) {
  const columns = [];
  columns.push('created_at', 'updated_at', 'user_created', 'name', 'status');

  class AdminPagingFilterDto extends PagingFilterDto {
    @IsEnum(columns)
    @IsOptional()
    @ApiPropertyOptional({
      description: 'sort column',
      enum: columns,
      default: 'created_at',
    })
    sort_by?: string;

    @IsEnum(['asc', 'desc'])
    @IsOptional()
    @ApiPropertyOptional({
      description: 'sort order',
      enum: ['asc', 'desc'],
      default: 'desc',
    })
    sort_order?: string;

    @IsEnum(Object.values(ActiveStates))
    @IsOptional()
    @ApiPropertyOptional({
      description: 'filter by active states',
      enum: ActiveStates,
      default: ActiveStates.Active,
    })
    activate_state?: ActiveStates;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'search keyword', nullable: true })
    search?: string;
  }

  return AdminPagingFilterDto;
}

export class SuccessResponseDto {
  @ApiProperty({ description: 'is request success?', example: true })
  success: boolean;

  constructor() {
    this.success = true;
  }
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'is request success?', example: false })
  success: boolean;

  @ApiProperty({ description: 'error information' })
  error: ErrorResponse;

  constructor(error: AppException) {
    this.success = false;
    this.error = { code: error.code, message: error.message, data: error.data };
  }
}

export function ListResponseDto<T extends Type>(ClassDef: T) {
  class ListResponseDto extends SuccessResponseDto {
    @ApiProperty({ description: 'total record', example: 10 })
    total: number;

    @ApiProperty({
      type: ClassDef,
      isArray: true,
      description: 'record list',
    })
    data: T[];
  }

  return ListResponseDto;
}

export function DetailResponseDto<T extends Type>(ClassDef: T) {
  class DetailResponseDto extends SuccessResponseDto {
    @ApiProperty({ description: 'is succeeded?', example: false })
    success: boolean;

    @ApiProperty({ type: ClassDef, description: 'response data' })
    data: T;
  }

  return DetailResponseDto;
}

export interface DateFilter {
  from?: string;
  to?: string;
}

export class BaseEntry {
  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  id: string;

  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  created_at: Date;

  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  updated_at: Date;

  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  deleted_at: Date;
}

export function BaseOldResponse<T extends Type>(ModelDef: T) {
  class OldResponse {
    @ApiProperty({
      description: 'status code',
      example: HttpStatus.OK,
      nullable: true,
      default: HttpStatus.OK,
    })
    statusCode: number;

    @ApiProperty({ description: 'data', type: ModelDef })
    data: T;
  }
  return OldResponse;
}

export class SuccessWithMessageResponseDto {
  @ApiProperty({ description: 'is succeeded?', example: true })
  success: boolean;

  @ApiProperty({
    type: 'string',
    description: 'response message',
    example: 'Success',
  })
  data: string;
}
