import { Inject, Injectable } from '@nestjs/common';
import { ForgetPasswordDto, SignInDto, SignUpDto } from './auth.dto';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private userService: UserService
  ) {}

  async signIn(payload: SignInDto) {
    return;
  }

  async signUp(payload: SignUpDto) {
    return;
  }

  async forgetPassword(payload: ForgetPasswordDto) {
    return;
  }
}