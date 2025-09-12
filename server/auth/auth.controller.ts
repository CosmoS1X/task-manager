import { Controller, Get, Post, Query, Body, Session, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { SessionData } from 'express-session';
import { User } from '@server/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CheckEmailDto } from './dto/check-email.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-email')
  async checkEmailAvailability(
    @Query() checkEmailDto: CheckEmailDto,
  ): Promise<{ isAvailable: boolean }> {
    return this.authService.checkEmailAvailability(checkEmailDto.email);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: SessionData,
  ): Promise<User> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    await this.authService.login(user.id, session);

    return user;
  }

  @Get('check-auth')
  async checkAuth(@Session() session: SessionData): Promise<User> {
    return this.authService.checkAuth(session);
  }

  @Post('logout')
  async logout(
    @Session() session: SessionData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(session, response);
  }
}
