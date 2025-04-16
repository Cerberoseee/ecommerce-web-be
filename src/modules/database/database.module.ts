import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigServiceKeys } from 'src/common';
import { UserModel } from 'src/models/users.model';

const sequelizeModule = SequelizeModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    dialect: 'postgres',
    username: configService.getOrThrow(ConfigServiceKeys.DB_USERNAME),
    password: configService.getOrThrow(ConfigServiceKeys.DB_PASSWORD),
    database: configService.getOrThrow(ConfigServiceKeys.DB_NAME),
    port: +configService.get(ConfigServiceKeys.DB_PORT, 5432),
    schema: configService.get(ConfigServiceKeys.HARD_CODE_SCHEMA),
    models: [
      UserModel
    ],
  }),
});

@Module({
  imports: [sequelizeModule],
})
export class DatabaseModule { }
