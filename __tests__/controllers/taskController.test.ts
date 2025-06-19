import request from 'supertest';
import app from '../../server';
import { Task, Status, User, Label } from '../../server/models';
import Endpoints from '../../server/endpoints';
import {
  createStatusData,
  createUserData,
  createLabelData,
  createTaskData,
  getTaskPath,
  buildQueryString,
} from '../helpers';

describe('Task controller', () => {
  let testStatus: Status;
  let testCreator: User;
  let testExecutor: User;
  let testLabel: Label;
  let testTask: Task;
  let agent: request.Agent;

  beforeAll(async () => {
    const statusData = createStatusData();
    const creatorData = createUserData();
    const executorData = createUserData();
    const labelData = createLabelData();
    const creatorCredentials = { email: creatorData.email, password: creatorData.password };
    testStatus = await Status.query().insert(statusData);
    testCreator = await User.query().insert(creatorData);
    testExecutor = await User.query().insert(executorData);
    testLabel = await Label.query().insert(labelData);
    testTask = await Task.query().insert({
      ...createTaskData(),
      statusId: testStatus.id,
      creatorId: testCreator.id,
      executorId: testExecutor.id,
    });

    agent = request.agent(app);
    await agent.post(Endpoints.Login).send(creatorCredentials);
  });

  afterAll(async () => {
    await Task.query().delete();
    await Status.query().delete();
    await User.query().delete();
    await Label.query().delete();
  });

  describe(`GET ${Endpoints.Tasks}`, () => {
    it('should require authentication', async () => {
      const response = await request(app).get(Endpoints.Tasks);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('NotAuthenticated');
    });

    it('should return list of tasks', async () => {
      const response = await agent.get(Endpoints.Tasks);

      expect(response.status).toBe(200);
    });

    it('should filter tasks by status', async () => {
      const existentStatusResponse = await agent.get(buildQueryString({ status: testStatus.id }));

      expect(existentStatusResponse.status).toBe(200);
      expect(existentStatusResponse.body.length).toBe(1);

      const nonExistentStatusResponse = await agent.get(buildQueryString({ status: Infinity }));

      expect(nonExistentStatusResponse.status).toBe(200);
      expect(nonExistentStatusResponse.body.length).toBe(0);
    });

    it('should filter tasks by creator', async () => {
      const response = await agent.get(buildQueryString({ isCreator: true }));

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it('should filter tasks by executor', async () => {
      const existentExecutorResponse = await agent
        .get(buildQueryString({ executor: testExecutor.id }));

      expect(existentExecutorResponse.status).toBe(200);
      expect(existentExecutorResponse.body.length).toBe(1);

      const nonExistentExecutorResponse = await agent.get(buildQueryString({ executor: Infinity }));

      expect(nonExistentExecutorResponse.status).toBe(200);
      expect(nonExistentExecutorResponse.body.length).toBe(0);
    });

    it('should apply all filters', async () => {
      const filters = {
        status: testStatus.id,
        executor: testExecutor.id,
        label: testLabel.id,
        isCreator: true,
      };
      const queryString = buildQueryString(filters);
      const response = await agent.get(queryString);

      expect(queryString).toBe(`${Endpoints.Tasks}?status=${filters.status}&executor=${filters.executor}&label=${filters.label}&isCreator=${filters.isCreator}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe(`GET ${Endpoints.Task}`, () => {
    it('should return task by id', async () => {
      const response = await agent.get(getTaskPath(testTask.id));

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testTask.name);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await agent.get(getTaskPath(Infinity));

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TaskNotFound');
    });
  });

  describe(`POST ${Endpoints.Tasks}`, () => {
    it('should create new task', async () => {
      const newTaskData = {
        ...createTaskData(),
        statusId: testStatus.id,
        executorId: testExecutor.id,
        labelIds: [testLabel.id],
      };

      const response = await agent.post(Endpoints.Tasks).send(newTaskData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newTaskData.name);
      expect(response.body.creatorId).toBe(testCreator.id);

      const createdTask = await Task.query()
        .findById(response.body.id)
        .withGraphFetched('labels');

      expect(createdTask?.labels?.length).toBe(1);
      expect(createdTask?.labels?.[0].name).toBe(testLabel.name);
    });

    it('should validate input data', async () => {
      const invalidTask = {
        name: '',
        statusId: '',
      };

      const response = await agent.post(Endpoints.Tasks).send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ValidationError');
    });
  });

  describe(`PATCH ${Endpoints.Task}`, () => {
    it('should update task', async () => {
      const updates = { ...testTask, ...createTaskData(), labelIds: [testLabel.id] };
      const response = await agent.patch(getTaskPath(testTask.id)).send(updates);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);
      expect(response.body.description).toBe(updates.description);

      const updatedTask = await Task.query()
        .findById(testTask.id)
        .withGraphFetched('labels');

      expect(updatedTask?.labels?.length).toBe(1);
      expect(updatedTask?.labels?.[0].name).toBe(testLabel.name);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await agent
        .patch(getTaskPath(Infinity))
        .send({ ...testTask, ...createTaskData() });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TaskNotFound');
    });
  });

  describe(`DELETE ${Endpoints.Task}`, () => {
    let taskToDelete: Task;

    beforeEach(async () => {
      taskToDelete = await Task.query().insert({
        ...createTaskData(),
        statusId: testStatus.id,
        creatorId: testCreator.id,
      });
    });

    it('should delete task', async () => {
      const response = await agent.delete(getTaskPath(taskToDelete.id));

      expect(response.status).toBe(204);

      const deletedTask = await Task.query().findById(taskToDelete.id);

      expect(deletedTask).toBeUndefined();
    });

    it('should not allow deletion by non-creator', async () => {
      const otherUserData = createUserData();
      const otherUserCredentials = { email: otherUserData.email, password: otherUserData.password };

      await agent.post(Endpoints.Logout);
      await User.query().insert(otherUserData);
      await agent.post(Endpoints.Login).send(otherUserCredentials);

      const response = await agent.delete(getTaskPath(taskToDelete.id));

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await agent.delete(getTaskPath(Infinity));

      expect(response.status).toBe(404);
    });
  });
});
