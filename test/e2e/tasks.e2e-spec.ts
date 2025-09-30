import request from 'supertest';
import type { Server } from 'http';
import { getTestServer } from '../test-server';
import { Task } from '../../server/tasks/entities/task.entity';
import { Status } from '../../server/statuses/entities/status.entity';
import { Label } from '../../server/labels/entities/label.entity';
import { User } from '../../server/users/entities/user.entity';
import { TaskLabel } from '../../server/tasks/entities/task-label.entity';
import Endpoints from '../endpoints';
import {
  createStatusData,
  createUserData,
  createLabelData,
  createTaskData,
  getTaskPath,
} from '../helpers';

describe('Tasks (E2E)', () => {
  let httpServer: Server;
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
    httpServer = await getTestServer();
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

    agent = request.agent(httpServer);
    await agent.post(Endpoints.Login).send(creatorCredentials);
  });

  afterAll(async () => {
    await Task.query().delete();
    await Status.query().delete();
    await User.query().delete();
    await Label.query().delete();
    await TaskLabel.query().delete();
  });

  describe(`GET ${Endpoints.Tasks}`, () => {
    it('should require authentication', async () => {
      const response = await request(httpServer).get(Endpoints.Tasks);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return list of tasks', async () => {
      const response = await agent.get(Endpoints.Tasks);

      expect(response.status).toBe(200);
    });

    it('should filter tasks by status', async () => {
      const existentStatusResponse = await agent.get(`${Endpoints.Tasks}?status=${testStatus.id}`);

      expect(existentStatusResponse.status).toBe(200);
      expect(existentStatusResponse.body).toHaveLength(1);

      const nonExistentStatusResponse = await agent.get(`${Endpoints.Tasks}?status=${99999}`);

      expect(nonExistentStatusResponse.status).toBe(200);
      expect(nonExistentStatusResponse.body).toHaveLength(0);
    });

    it('should filter tasks by creator', async () => {
      const response = await agent.get(`${Endpoints.Tasks}?isCreator=true`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter tasks by executor', async () => {
      const existentExecutorResponse = await agent.get(
        `${Endpoints.Tasks}?executor=${testExecutor.id}`,
      );

      expect(existentExecutorResponse.status).toBe(200);
      expect(existentExecutorResponse.body).toHaveLength(1);

      const nonExistentExecutorResponse = await agent.get(`${Endpoints.Tasks}?executor=${99999}`);

      expect(nonExistentExecutorResponse.status).toBe(200);
      expect(nonExistentExecutorResponse.body).toHaveLength(0);
    });

    it('should apply all filters', async () => {
      const response = await agent.get(
        `${Endpoints.Tasks}?status=${testStatus.id}&executor=${testExecutor.id}&label=${testLabel.id}&isCreator=true`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe(`GET ${Endpoints.Task}`, () => {
    it('should return task by id', async () => {
      const response = await agent.get(getTaskPath(testTask.id));

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testTask.name);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await agent.get(getTaskPath(99999));

      expect(response.status).toBe(404);
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

      const createdTask = await Task.query().findById(response.body.id).withGraphFetched('labels');

      expect(createdTask?.labels).toHaveLength(1);
      expect(createdTask?.labels?.[0].name).toBe(testLabel.name);
    });

    it('should validate input data', async () => {
      const invalidTask = {
        name: '',
        statusId: '',
      };

      const response = await agent.post(Endpoints.Tasks).send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request'); // error type from NestJS ValidationPipe
    });
  });

  describe(`PATCH ${Endpoints.Task}`, () => {
    it('should update task', async () => {
      const anotherStatus = await Status.query().insert(createStatusData());
      const anotherExecutor = await User.query().insert(createUserData());

      const updates = {
        ...createTaskData(),
        statusId: anotherStatus.id,
        executorId: anotherExecutor.id,
        labelIds: [testLabel.id],
      };

      const response = await agent.patch(getTaskPath(testTask.id)).send(updates);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);
      expect(response.body.description).toBe(updates.description);
      expect(response.body.statusId).toBe(anotherStatus.id);
      expect(response.body.executorId).toBe(anotherExecutor.id);

      const updatedTask = await Task.query().findById(testTask.id).withGraphFetched('labels');

      expect(updatedTask?.labels).toHaveLength(1);
      expect(updatedTask?.labels?.[0].name).toBe(testLabel.name);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await agent.patch(getTaskPath(99999)).send(createTaskData());

      expect(response.status).toBe(404);
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
      const response = await agent.delete(getTaskPath(99999));

      expect(response.status).toBe(404);
    });
  });
});
