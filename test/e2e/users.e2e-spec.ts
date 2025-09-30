import request from 'supertest';
import type { Server } from 'http';
import { getTestServer } from '../test-server';
import { User } from '../../server/users/entities/user.entity';
import { createUserData, getUserPath, getCheckEmailQueryString } from '../helpers';
import Endpoints from '../endpoints';

describe('Users (E2E)', () => {
  let httpServer: Server;
  let testUser: User;
  let credentials: { email: string; password: string };
  let agent: request.Agent;

  beforeEach(async () => {
    const userData = createUserData();
    httpServer = await getTestServer();
    credentials = { email: userData.email, password: userData.password };
    testUser = await User.query().insert(userData);
    agent = request.agent(httpServer);
  });

  afterEach(async () => {
    await User.query().delete();
  });

  describe(`GET ${Endpoints.Users}`, () => {
    it('should require authentication', async () => {
      const response = await request(httpServer).get(Endpoints.Users);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return list of users when authenticated', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.get(Endpoints.Users);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe(`POST ${Endpoints.Users}`, () => {
    it('should create a new user', async () => {
      const newUserData = createUserData();
      const response = await request(httpServer).post(Endpoints.Users).send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(newUserData.email);
    });

    it('should not allow duplicate emails', async () => {
      const userWithSameEmail = { ...createUserData(), email: testUser.email };
      const response = await request(httpServer).post(Endpoints.Users).send(userWithSameEmail);

      expect(response.status).toBe(409);
    });
  });

  describe(`GET ${Endpoints.User}`, () => {
    it('should return 403 if user tries to access another user', async () => {
      const anotherUserData = createUserData();
      const anotherUser = await User.query().insert(anotherUserData);

      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.get(getUserPath(anotherUser.id));

      expect(response.status).toBe(403);
    });

    it('should return user if owner', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.get(getUserPath(testUser.id));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUser.id);
    });
  });

  describe(`PATCH ${Endpoints.User}`, () => {
    it('should update user without password', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const updates = createUserData();

      const response = await agent.patch(getUserPath(testUser.id)).send({
        firstName: updates.firstName,
        lastName: updates.lastName,
      });

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(updates.firstName);
      expect(response.body.lastName).toBe(updates.lastName);
    });

    it('should update password when current password is correct', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const updates = {
        currentPassword: credentials.password,
        newPassword: createUserData().password,
      };

      const response = await agent.patch(getUserPath(testUser.id)).send(updates);

      expect(response.status).toBe(200);

      const updatedUser = await User.query().findById(testUser.id);

      expect(updatedUser?.verifyPassword(updates.newPassword)).toBeTruthy();
      expect(updatedUser?.verifyPassword(updates.currentPassword)).toBeFalsy();
    });

    it('should return 403 when new password provided without current password', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const updates = { newPassword: createUserData().password };

      const response = await agent.patch(getUserPath(testUser.id)).send(updates);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('CurrentPasswordRequired');
    });

    it('should return 403 when current password is incorrect', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const updates = {
        currentPassword: 'wrongPassword',
        newPassword: createUserData().password,
      };

      const response = await agent.patch(getUserPath(testUser.id)).send(updates);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('InvalidPassword');
    });

    it('should update both profile and password when all data is valid', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const newData = createUserData();
      const updates = {
        firstName: newData.firstName,
        currentPassword: credentials.password,
        newPassword: newData.password,
      };

      const response = await agent.patch(getUserPath(testUser.id)).send(updates);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(updates.firstName);

      const updatedUser = await User.query().findById(testUser.id);

      expect(updatedUser?.verifyPassword(updates.newPassword)).toBeTruthy();
    });

    it('should not allow changing email to an existing one', async () => {
      const anotherUserData = createUserData();
      const anotherUser = await User.query().insert(anotherUserData);

      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent
        .patch(getUserPath(testUser.id))
        .send({ email: anotherUser.email });

      expect(response.status).toBe(409);
    });
  });

  describe(`DELETE ${Endpoints.User}`, () => {
    it('should delete user', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.delete(getUserPath(testUser.id));

      expect(response.status).toBe(204);

      const deletedUser = await User.query().findById(testUser.id);

      expect(deletedUser).toBeUndefined();
    });

    it('should return 403 when trying to delete another user', async () => {
      const anotherUserData = createUserData();
      const anotherUser = await User.query().insert(anotherUserData);

      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.delete(getUserPath(anotherUser.id));

      expect(response.status).toBe(403);
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
