import { Task, Status, User } from '../../server/models';
import { createStatusData, createUserData, createTaskData } from '../helpers';

describe('Task Model', () => {
  let testStatus: Status;
  let testCreator: User;
  let testExecutor: User;
  let testTask: {
    name: string;
    description: string | null;
    statusId: number;
    creatorId: number;
    executorId: number | null;
  };

  beforeAll(async () => {
    testStatus = await Status.query().insert(createStatusData());
    testCreator = await User.query().insert(createUserData());
    testExecutor = await User.query().insert(createUserData());
    testTask = {
      ...createTaskData(),
      statusId: testStatus.id,
      creatorId: testCreator.id,
      executorId: null,
    };
  });

  afterAll(async () => {
    await Task.query().delete();
    await Status.query().delete();
    await User.query().delete();
  });

  it('should create a task', async () => {
    const task = await Task.query().insert(testTask);

    expect(task).toBeDefined();
    expect(task.name).toBe(testTask.name);
    expect(task.statusId).toBe(testStatus.id);
    expect(task.creatorId).toBe(testCreator.id);
    expect(task.executorId).toBeNull();
  });

  it('should require name, statusId and creatorId', async () => {
    await expect(Task.query().insert({})).rejects.toThrow();
  });

  it('should validate name length', async () => {
    await expect(Task.query().insert({ ...testTask, name: '' })).rejects.toThrow();
    await expect(Task.query().insert({ ...testTask, name: 'a'.repeat(256) })).rejects.toThrow();
  });

  it('should have relations', async () => {
    const task = await Task.query()
      .insert({ ...testTask, executorId: testExecutor.id })
      .withGraphFetched('[status, creator, executor]');

    expect(task.status?.name).toBe(testStatus.name);
    expect(task.creator?.email).toBe(testCreator.email);
    expect(task.executor?.email).toBe(testExecutor.email);
  });
});
