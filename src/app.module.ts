import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import config from './common/config/config';
import { DbModule } from './db/db.module';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TaskModule,
    DbModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
  ],
})
export class AppModule {}
