import { IsOptional, IsString } from 'class-validator';
import { PaginationFilter } from 'src/common';

export class ListUserDto extends PaginationFilter {
  @IsString()
  @IsOptional()
  search?: string;

}