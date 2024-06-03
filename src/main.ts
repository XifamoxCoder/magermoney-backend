import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { certificateConfig } from '../secrets/certificates';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: { ...certificateConfig },
  });
  const config = app.get(ConfigService);

  const port = config.get<number>('port');
  const host = config.get<string>('host');

  await app.listen(port, host);

  Logger.log(`Application is running on https://${host}:${port}`, NestApplication.name);
}
bootstrap();
