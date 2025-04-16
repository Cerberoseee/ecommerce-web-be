import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/models/users.model';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
