import { AppDataSource } from '../data-source';

describe('Database connection test', () => {
  it('should connect to database', async () => {
    expect(AppDataSource.isInitialized).toBe(true);

    const result = await AppDataSource.query('SELECT 1 AS test');

    expect(result[0].test).toBe(1);
  });

  it('should have no entities initially', async () => {
    const entities = AppDataSource.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = AppDataSource.getRepository(entity.name);
      const count = await repository.count();

      expect(count).toBe(0);
    });
  });
});
