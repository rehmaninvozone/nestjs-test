import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '../auth/password.service';
import { UsersController } from './user.controller';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, PasswordService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
