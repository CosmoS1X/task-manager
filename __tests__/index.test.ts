import type { Server } from 'http';
import app from '../server';
import env from '../env';

test('Server should start without errors', async () => {
  const port = env.PORT;

  const server: Server = await new Promise((resolve, reject) => {
    const srv = app.listen(port, () => resolve(srv));

    srv.on('error', reject);
  });

  expect(server).toBeDefined();
  server.close();
});
