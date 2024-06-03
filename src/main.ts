import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { certificateConfig } from '../secrets/certificates';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: { ...certificateConfig },
  });
  const config = app.get(ConfigService);
  const apiGlobalPrefix = `${config.get<string>('apiPrefix')}/${config.get<string>('apiVersion')}`;

  const port = config.get<number>('port');
  const host = config.get<string>('host');

  app.enableCors();
  app.setGlobalPrefix(apiGlobalPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Magermoney API')
    .setDescription('Magermoney API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = `${apiGlobalPrefix}/${config.get<string>('apiDocsPath')}`;

  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(port, host);

  Logger.log(`Application is running on https://${host}:${port}`, NestApplication.name);
}
bootstrap();
