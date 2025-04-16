import { Body, Controller, Inject, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BaseController } from 'src/common/base/base.controller';
import { AuthService } from './auth.service';
import * as express from 'express';
import { ForgetPasswordDto, SignInDto, SignUpDto } from './auth.dto';
import { CorsInterceptor } from 'src/common/interceptors/cors.interceptor';

@ApiTags('Auth')
@Controller('/v1/auth')
@UseGuards(ThrottlerGuard)
export class AuthController extends BaseController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {
    super()
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(@Res() response: express.Response, @Body() data: SignInDto) {
    const authRes = await this.authService.signIn(data);
    return this.successResponse(response, authRes);
  }
  
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign Up' })
  @UseInterceptors(CorsInterceptor)
  async signUp(
    @Res() response: express.Response,
    @Body() data: SignUpDto,
  ) {
    const authRes = await this.authService.signUp(
      data,
    );
    return this.successResponse(response, authRes);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Forget password' })
  async forgetPasswrd(
    @Res() response: express.Response,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ) {
    const authRes = await this.authService.forgetPassword(forgetPasswordDto);
    return this.successResponse(response, authRes);
  }
}