import { Status } from '../../server/models';
import { createStatus } from '../helpers';

describe('Status Model', () => {
  let testStatus: { name: string };

  beforeEach(async () => {
    await Status.query().delete();
    testStatus = createStatus();
  });

  it('should create a status', async () => {
    const status = await Status.query().insert(testStatus);

    expect(status).toBeDefined();
    expect(status.id).toBeDefined();
    expect(status.name).toBe(testStatus.name);
  });

  it('should validate name length', async () => {
    await expect(Status.query().insert({ name: '' })).rejects.toThrow();
    await expect(Status.query().insert({ name: 'a'.repeat(256) })).rejects.toThrow();
  });

  it('should enforce unique names', async () => {
    await Status.query().insert(testStatus);

    await expect(Status.query().insert(testStatus)).rejects.toThrow();
  });
});
