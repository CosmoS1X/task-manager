import app from '../server';

test('Server should start without errors', async () => {
  const port = process.env.PORT || 5000;

  const server = await new Promise((resolve, reject) => {
    const srv = app.listen(port, () => resolve(srv));

    srv.on('error', reject);
  });

  expect(server).toBeDefined();
  (server as any).close();
});
