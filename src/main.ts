import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    maxAge: 3600,
  });
  app.setGlobalPrefix('/api');
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addServer('/')
    .setTitle('API document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    'document',
    app,
    document,
  );
  const port: number = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
