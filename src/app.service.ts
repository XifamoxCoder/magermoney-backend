import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo() {
    return {
      title: 'Hello world',
      author: 'xifamox',
      version: this.configService.get<string>('apiVersion'),
      timestamp: new Date().toISOString(),
    };
  }
}
