import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import type { SessionData } from 'express-session';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/repositories/user.repository';
import { AuthService } from './auth.service';

describe('Auth Service (Unit)', () => {
  const createMockResponse = (): jest.Mocked<Partial<Response>> => (
    jest.mocked({ clearCookie: jest.fn() })
  );

  const createMockSession = (
    destroyBehavior: (callback: (error?: Error | null) => void) => void,
  ): SessionData => ({
    destroy: jest.fn(destroyBehavior),
    cookie: { originalMaxAge: null },
  });

  let authService: AuthService;

  beforeEach(async () => {
    const mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logout', () => {
    it('should handle session destruction error', async () => {
      const response = createMockResponse();
      const session = createMockSession((callback) => {
        callback(new Error('Session destruction failed'));
      });

      const logoutPromise = authService.logout(session, response as Response);

      await expect(logoutPromise).rejects.toThrow(UnauthorizedException);
    });

    it('should logout successfully', async () => {
      const response = createMockResponse();
      const session = createMockSession((callback) => {
        callback(null); // No error
      });

      await authService.logout(session, response as Response);

      expect(response.clearCookie).toHaveBeenCalledWith('taskmanager.sid', {
        path: '/',
        httpOnly: true,
        secure: expect.any(Boolean),
      });
    });
  });
});
