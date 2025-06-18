import { Label } from '../../server/models';
import { createLabel } from '../helpers';

describe('Label Model', () => {
  let testLabel: { name: string };

  beforeEach(async () => {
    await Label.query().delete();
    testLabel = createLabel();
  });

  it('should create a label', async () => {
    const label = await Label.query().insert(testLabel);

    expect(label).toBeDefined();
    expect(label.id).toBeDefined();
    expect(label.name).toBe(testLabel.name);
  });

  it('should validate name length', async () => {
    await expect(Label.query().insert({ name: '' })).rejects.toThrow();
    await expect(Label.query().insert({ name: 'a'.repeat(256) })).rejects.toThrow();
  });

  it('should enforce unique names', async () => {
    await Label.query().insert(testLabel);

    await expect(Label.query().insert(testLabel)).rejects.toThrow();
  });
});
