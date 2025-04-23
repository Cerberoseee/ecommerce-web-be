import { UseGuards, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/base.controller';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@ApiTags('User')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('/v1/users')
export class UserController extends BaseController {
  constructor(
    private userService: UserService
  ) {
    super();
  }

  @Get()
  async getList() {
    return [
      { a: 'a', b: 'a'},
      { a: 'a', b: 'a' },

    ];
  }

  @Post()
  @UseGuards(AdminGuard)
  async createAccount() {
    // return await this.userService.create;
  }
}