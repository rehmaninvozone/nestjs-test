import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Request as Req } from 'express';
import { IsAdmin } from '../common/decorators/is-admin.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { InviteUserDto } from './dto/invite-user.dto';
import { UsersService } from '../users/users.service';
import { IsAdminGuard } from './guards/is-admin.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: Req): { access_token: string } {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(@Body() signUpDto: SignUpDto): Promise<{
    message: string;
  }> {
    return this.authService.register(signUpDto);
  }

  @ApiOperation({ summary: 'Invite a user' })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth()
  @Post('invite')
  @IsAdmin()
  async invite(@Body() inviteUserDto: InviteUserDto): Promise<{
    message: string;
  }> {
    const invitedUser = await this.usersService.findOrCreate(inviteUserDto);
    const inviteToken = await this.authService.generateInviteToken(invitedUser);
    console.log(`Invite token for ${inviteUserDto.email}: ${inviteToken}`);
    return { message: 'Invite sent successfully' };
  }

  @ApiOperation({ summary: 'Resend invite' })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @ApiBearerAuth()
  @Post('resent-invite')
  @IsAdmin()
  async resentInvite(@Body() inviteUserDto: InviteUserDto): Promise<{
    message: string;
  }> {
    const invitedUser = await this.usersService.findByEmail(
      inviteUserDto.email,
    );
    const inviteToken = await this.authService.resendInviteToken(invitedUser);
    console.log(
      `Invite token resent for ${inviteUserDto.email}: ${inviteToken}`,
    );
    return { message: 'Invite resent successfully' };
  }
}
