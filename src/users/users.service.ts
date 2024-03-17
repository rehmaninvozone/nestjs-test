import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InviteUserDto } from '../auth/dto/invite-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async findById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async create(inviteUserDto: InviteUserDto): Promise<UserEntity> {
    const entity = Object.assign(new UserEntity(), inviteUserDto);
    return this.usersRepository.save(entity);
  }

  async findOrCreate(inviteUserDto: InviteUserDto): Promise<UserEntity> {
    const user = await this.findByEmail(inviteUserDto.email);
    if (!user) {
      return await this.create(inviteUserDto);
    }
    return user;
  }
}
