import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { ApiModule } from '@/api/api.module';
import { appConfig, databaseConfig, smtpConfig } from '@/config';
import { SharedModule } from '@/shared/shared.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, smtpConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    ApiModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
