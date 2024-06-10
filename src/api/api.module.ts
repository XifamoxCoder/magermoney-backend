import { Module } from '@nestjs/common';

import { AuthModule } from '@/api/auth/auth.module';
import { UsersModule } from '@/api/users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
  exports: [UsersModule, AuthModule],
})
export class ApiModule {}
