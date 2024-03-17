import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { PasswordService } from './password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotAcceptableException('credentials mismatch');
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new NotAcceptableException('credentials mismatch');
    }
    return user;
  }

  login(user: any): { access_token: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { name, password, inviteToken } = signUpDto;

    // Verify invite token and update password
    const user = await this.verifyInviteToken(inviteToken);

    // Update user
    user.name = name;
    user.password = await this.passwordService.hashPassword(password);

    // Optionally, you can clear inviteToken and inviteTokenExpiry fields here
    await this.usersRepository.save(user);
    return { message: 'User signed up successfully' };
  }

  async generateInviteToken(user: UserEntity): Promise<string> {
    const inviteToken = Math.random().toString(36).substring(2, 15);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // Expires in 1 day
    user.inviteToken = inviteToken;
    user.inviteTokenExpiry = expiryDate;
    await this.usersRepository.save(user);
    return inviteToken;
  }

  async resendInviteToken(user: UserEntity): Promise<string> {
    return this.generateInviteToken(user);
  }

  async verifyInviteToken(inviteToken: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ inviteToken });
    if (!user || user.inviteTokenExpiry < new Date()) {
      throw new NotFoundException('Invalid or expired invite token');
    }
    return user;
  }
}
