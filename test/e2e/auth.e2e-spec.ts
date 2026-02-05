import request from 'supertest';
import type { Server } from 'http';
import { AppDataSource } from '../../data-source';
import { getTestServer } from '../test-server';
import { User } from '../../server/users/entities/user.entity';
import { createUserData, hashUserPassword, getCheckEmailQueryString } from '../helpers';
import Endpoints from '../endpoints';

describe('Auth (E2E)', () => {
  let httpServer: Server;
  let testUser: User;
  let credentials: { email: string; password: string };
  let agent: request.Agent;

  beforeEach(async () => {
    const userData = createUserData();
    httpServer = await getTestServer();
    credentials = { email: userData.email, password: userData.password };
    testUser = await AppDataSource.getRepository(User).save(hashUserPassword(userData));
    agent = request.agent(httpServer);
  });

  afterEach(async () => {
    await AppDataSource.query('DELETE FROM users');
  });

  describe(`POST ${Endpoints.Login}`, () => {
    it('should login with correct credentials', async () => {
      const response = await request(httpServer).post(Endpoints.Login).send(credentials);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should not login with incorrect email', async () => {
      const response = await request(httpServer)
        .post(Endpoints.Login)
        .send({ ...credentials, email: 'wrong@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User with this email not found');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(httpServer)
        .post(Endpoints.Login)
        .send({ ...credentials, password: 'wrong_password' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Incorrect password');
    });

    it('should set session cookie on successful login', async () => {
      const response = await request(httpServer).post(Endpoints.Login).send(credentials);

      expect(response.status).toBe(201);
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe(`GET ${Endpoints.CheckAuth}`, () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(httpServer).get(Endpoints.CheckAuth);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return user data when authenticated', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.get(Endpoints.CheckAuth);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
    });
  });

  describe(`POST ${Endpoints.Logout}`, () => {
    it('should logout and clear session', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const checkAuthResponse = await agent.get(Endpoints.CheckAuth);
      expect(checkAuthResponse.status).toBe(200);

      const logoutResponse = await agent.post(Endpoints.Logout);
      expect(logoutResponse.status).toBe(201);

      const newCheckAuthResponse = await agent.get(Endpoints.CheckAuth);
      expect(newCheckAuthResponse.status).toBe(401);
    });
  });

  describe('Session persistence', () => {
    it('should maintain session across requests', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response1 = await agent.get(Endpoints.CheckAuth);
      const response2 = await agent.get(Endpoints.CheckAuth);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe(`GET ${Endpoints.CheckEmail}`, () => {
    it('should check email availability', async () => {
      const takenResponse = await request(httpServer).get(getCheckEmailQueryString(testUser.email));

      expect(takenResponse.status).toBe(200);
      expect(takenResponse.body.isAvailable).toBeFalsy();

      const availableResponse = await request(httpServer).get(
        getCheckEmailQueryString('new@example.com'),
      );

      expect(availableResponse.status).toBe(200);
      expect(availableResponse.body.isAvailable).toBeTruthy();
    });
  });
});
