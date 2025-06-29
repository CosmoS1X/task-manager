import request from 'supertest';
import app from '../../server';
import { Status, User } from '../../server/models';
import { createUserData, createStatusData, getStatusPath } from '../helpers';
import Endpoints from '../../server/endpoints';

describe('Status controller', () => {
  let testStatus: Status;
  let agent: request.Agent;

  beforeAll(async () => {
    const userData = createUserData();
    const credentials = { email: userData.email, password: userData.password };
    await User.query().insert(userData);
    agent = request.agent(app);
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
      const response = await request(app).get(Endpoints.Statuses);

      expect(response.status).toBe(401);
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
      const response = await agent.get(getStatusPath(Infinity));

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('StatusNotFound');
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
      const response = await agent.post(Endpoints.Statuses).send(testStatus);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('StatusAlreadyExists');
    });

    it('should validate input data', async () => {
      const invalidStatus = { name: '' };
      const response = await agent.post(Endpoints.Statuses).send(invalidStatus);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('ValidationError');
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
      expect(response.body.error).toBe('StatusAlreadyExists');
    });

    it('should return 200 if name not changed', async () => {
      const response = await agent
        .patch(getStatusPath(testStatus.id))
        .send({ name: testStatus.name });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testStatus.name);
    });

    it('should return 404 for non-existent status', async () => {
      const response = await agent.patch(getStatusPath(Infinity)).send(createStatusData());

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('StatusNotFound');
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
      const response = await agent.delete(getStatusPath(Infinity));

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('StatusNotFound');
    });
  });
});
