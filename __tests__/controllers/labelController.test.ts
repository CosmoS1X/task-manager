import request from 'supertest';
import app from '../../server';
import { Label, User } from '../../server/models';
import { createUserData, createLabelData, getLabelPath } from '../helpers';
import Endpoints from '../../server/endpoints';

describe('Label controller', () => {
  let credentials: { email: string; password: string };
  let testLabel: Label;
  let agent: request.Agent;

  beforeAll(async () => {
    const userData = createUserData();
    credentials = { email: userData.email, password: userData.password };
    await User.query().insert(userData);
    agent = request.agent(app);
    await agent.post(Endpoints.Login).send(credentials);
  });

  afterAll(async () => {
    await User.query().delete();
  });

  beforeEach(async () => {
    const labelData = createLabelData();
    testLabel = await Label.query().insert(labelData);
  });

  afterEach(async () => {
    await Label.query().delete();
  });

  describe(`GET ${Endpoints.Labels}`, () => {
    it('should require authentication', async () => {
      const response = await request(app).get(Endpoints.Labels);

      expect(response.status).toBe(401);
    });

    it('should return list of labels', async () => {
      const response = await agent.get(Endpoints.Labels);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe(testLabel.name);
    });
  });

  describe(`GET ${Endpoints.Label}`, () => {
    it('should return label by id', async () => {
      const response = await agent.get(getLabelPath(testLabel.id));

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testLabel.name);
    });

    it('should return 404 for non-existent label', async () => {
      const response = await agent.get(getLabelPath(Infinity));

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('LabelNotFound');
    });
  });

  describe(`POST ${Endpoints.Labels}`, () => {
    it('should create new label', async () => {
      const newLabeData = createLabelData();
      const response = await agent.post(Endpoints.Labels).send(newLabeData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newLabeData.name);

      const createdLabel = await Label.query().findById(response.body.id);

      expect(createdLabel).toBeDefined();
    });

    it('should return 409 for duplicate label name', async () => {
      const response = await agent.post(Endpoints.Labels).send(testLabel);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('LabelAlreadyExists');
    });

    it('should validate input data', async () => {
      const invalidLabel = { name: '' };
      const response = await agent.post(Endpoints.Statuses).send(invalidLabel);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('ValidationError');
    });
  });

  describe(`PATCH ${Endpoints.Label}`, () => {
    it('should update label', async () => {
      const updates = createLabelData();
      const response = await agent.patch(getLabelPath(testLabel.id)).send(updates);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);

      const updatedLabel = await Label.query().findById(testLabel.id);

      expect(updatedLabel?.name).toBe(updates.name);
    });

    it('should return 409 for duplicate label name', async () => {
      const anotherLabelData = createLabelData();

      await Label.query().insert(anotherLabelData);

      const response = await agent.patch(getLabelPath(testLabel.id)).send(anotherLabelData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('LabelAlreadyExists');
    });

    it('should return 200 if name not changed', async () => {
      const response = await agent
        .patch(getLabelPath(testLabel.id))
        .send({ name: testLabel.name });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testLabel.name);
    });

    it('should return 404 for non-existent label', async () => {
      const response = await agent.patch(getLabelPath(Infinity)).send(createLabelData());

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('LabelNotFound');
    });
  });

  describe(`DELETE ${Endpoints.Label}`, () => {
    it('should delete label', async () => {
      const response = await agent.delete(getLabelPath(testLabel.id));

      expect(response.status).toBe(204);

      const deletedLabel = await Label.query().findById(testLabel.id);

      expect(deletedLabel).toBeUndefined();
    });

    it('should return 404 for non-existent label', async () => {
      const response = await agent.delete(getLabelPath(Infinity));

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('LabelNotFound');
    });
  });
});
