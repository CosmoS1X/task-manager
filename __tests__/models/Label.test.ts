import { Label } from '../../server/models';
import { createLabelData } from '../helpers';

describe('Label Model', () => {
  let labelData: { name: string };

  beforeEach(async () => {
    await Label.query().delete();
    labelData = createLabelData();
  });

  it('should create a label', async () => {
    const label = await Label.query().insert(labelData);

    expect(label).toBeDefined();
    expect(label.id).toBeDefined();
    expect(label.name).toBe(labelData.name);
  });

  it('should validate name length', async () => {
    await expect(Label.query().insert({ name: '' })).rejects.toThrow();
    await expect(Label.query().insert({ name: 'a'.repeat(256) })).rejects.toThrow();
  });

  it('should enforce unique names', async () => {
    await Label.query().insert(labelData);

    await expect(Label.query().insert(labelData)).rejects.toThrow();
  });
});
