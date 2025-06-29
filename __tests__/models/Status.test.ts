import { Status } from '../../server/models';
import { createStatusData } from '../helpers';

describe('Status Model', () => {
  let statusData: { name: string };

  beforeEach(async () => {
    await Status.query().delete();
    statusData = createStatusData();
  });

  it('should create a status', async () => {
    const status = await Status.query().insert(statusData);

    expect(status).toBeDefined();
    expect(status.id).toBeDefined();
    expect(status.name).toBe(statusData.name);
  });

  it('should validate name length', async () => {
    await expect(Status.query().insert({ name: '' })).rejects.toThrow();
    await expect(Status.query().insert({ name: 'a'.repeat(256) })).rejects.toThrow();
  });

  it('should enforce unique names', async () => {
    await Status.query().insert(statusData);

    await expect(Status.query().insert(statusData)).rejects.toThrow();
  });
});
