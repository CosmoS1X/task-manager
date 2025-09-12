import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import type { Response } from 'express';
import type { SessionData } from 'express-session';
import { UsersService } from '@server/users/users.service';
import { User } from '@server/users/entities/user.entity';
import env from '../../env';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UsersService) {}

  async checkEmailAvailability(email: string): Promise<{ isAvailable: boolean }> {
    const user = await this.usersService.findByEmail(email);

    return { isAvailable: !user };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.verifyPassword(password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async checkAuth(session: SessionData): Promise<User> {
    this.logger.log('Checking authentication status...');

    const { userId } = session;

    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    this.logger.log(`User with ID: ${userId} is authenticated`);

    return this.usersService.findById(userId);
  }

  async login(userId: number, session: SessionData): Promise<void> {
    this.logger.log(`Attempting login for user with ID: ${userId}...`);

    // eslint-disable-next-line no-param-reassign
    session.userId = userId;

    this.logger.log(`User with ID: ${userId} logged in successfully`);
  }

  async logout(session: SessionData, response: Response): Promise<void> {
    this.logger.log('Logging out user...');

    session.destroy((error: Error) => {
      if (error) {
        this.logger.error('Error destroying session during logout', error.stack);

        throw new UnauthorizedException('Error during logout');
      }
    });

    response.clearCookie('taskmanager.sid', {
      path: '/',
      httpOnly: true,
      secure: env.isProduction,
    });

    this.logger.log('User logged out successfully');
  }
}
