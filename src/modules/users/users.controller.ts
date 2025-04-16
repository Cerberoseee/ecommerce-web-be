import { UseGuards, Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/base.controller';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('/v1/users')
export class UserController extends BaseController {}