import request from 'supertest';
import type { Server } from 'http';
import { getTestServer } from '../test-server';
import { Status } from '../../server/statuses/entities/status.entity';
import { User } from '../../server/users/entities/user.entity';
import { createUserData, createStatusData, getStatusPath } from '../helpers';
import Endpoints from '../endpoints';

describe('Statuses (E2E)', () => {
  let httpServer: Server;
  let testStatus: Status;
  let agent: request.Agent;

  const nonExistentId = 99999;

  beforeAll(async () => {
    const userData = createUserData();
    const credentials = { email: userData.email, password: userData.password };
    httpServer = await getTestServer();
    await User.query().insert(userData);
    agent = request.agent(httpServer);
    await agent.post(Endpoints.Login).send(credentials);
  });

  afterAll(async () => {
    await User.query().delete();
  });

  beforeEach(async () => {
    const statusData = createStatusData();
    testStatus = await Status.query().insert(statusData);
  });

  afterEach(async () => {
    await Status.query().delete();
  });

  describe(`GET ${Endpoints.Statuses}`, () => {
    it('should require authentication', async () => {
      const response = await request(httpServer).get(Endpoints.Statuses);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return list of statuses', async () => {
      const response = await agent.get(Endpoints.Statuses);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe(testStatus.name);
    });
  });

  describe(`GET ${Endpoints.Status}`, () => {
    it('should return status by id', async () => {
      const response = await agent.get(getStatusPath(testStatus.id));

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testStatus.name);
    });

    it('should return 404 for non-existent status', async () => {
      const response = await agent.get(getStatusPath(nonExistentId));

      expect(response.status).toBe(404);
    });
  });

  describe(`POST ${Endpoints.Statuses}`, () => {
    it('should create new status', async () => {
      const newStatusData = createStatusData();
      const response = await agent.post(Endpoints.Statuses).send(newStatusData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newStatusData.name);

      const createdStatus = await Status.query().findById(response.body.id);

      expect(createdStatus).toBeDefined();
    });

    it('should return 409 for duplicate status name', async () => {
      const response = await agent.post(Endpoints.Statuses).send({ name: testStatus.name });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('UniqueViolationError');
    });

    it('should validate input data', async () => {
      const invalidStatus = { name: '' };
      const response = await agent.post(Endpoints.Statuses).send(invalidStatus);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request'); // error type from NestJS ValidationPipe
    });
  });

  describe(`PATCH ${Endpoints.Status}`, () => {
    it('should update status', async () => {
      const updates = createStatusData();
      const response = await agent.patch(getStatusPath(testStatus.id)).send(updates);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);

      const updatedStatus = await Status.query().findById(testStatus.id);

      expect(updatedStatus?.name).toBe(updates.name);
    });

    it('should return 409 for duplicate status name', async () => {
      const anotherStatusData = createStatusData();

      await Status.query().insert(anotherStatusData);

      const response = await agent.patch(getStatusPath(testStatus.id)).send(anotherStatusData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('UniqueViolationError');
    });

    it('should return 200 if name not changed', async () => {
      const response = await agent
        .patch(getStatusPath(testStatus.id))
        .send({ name: testStatus.name });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testStatus.name);
    });

    it('should return 404 for non-existent status', async () => {
      const response = await agent.patch(getStatusPath(nonExistentId)).send(createStatusData());

      expect(response.status).toBe(404);
    });
  });

  describe(`DELETE ${Endpoints.Status}`, () => {
    it('should delete status', async () => {
      const response = await agent.delete(getStatusPath(testStatus.id));

      expect(response.status).toBe(204);

      const deletedStatus = await Status.query().findById(testStatus.id);

      expect(deletedStatus).toBeUndefined();
    });

    it('should return 404 for non-existent status', async () => {
      const response = await agent.delete(getStatusPath(nonExistentId));

      expect(response.status).toBe(404);
    });
  });
});
