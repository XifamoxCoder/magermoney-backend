import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestApplication, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { certificateConfig } from '../secrets/certificates';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: { ...certificateConfig },
  });
  const config = app.get(ConfigService);
  const apiGlobalPrefix = `${config.get<string>('apiPrefix')}/${config.get<string>('apiVersion')}`;
  const { httpAdapter } = app.get(HttpAdapterHost);

  const port = config.get<number>('port');
  const host = config.get<string>('host');

  app.enableCors();
  app.setGlobalPrefix(apiGlobalPrefix);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

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
