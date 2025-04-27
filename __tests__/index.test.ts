import axios from 'axios';
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

test('Server should respond to /api/hello', async () => {
  const port = process.env.PORT || 5000;

  const server = await new Promise((resolve, reject) => {
    const srv = app.listen(port, () => resolve(srv));

    srv.on('error', reject);
  });

  try {
    const { data } = await axios.get(`http://localhost:${port}/api/hello`);

    expect(data).toEqual({ message: 'Hello from Express with TypeScript!' });
  } finally {
    (server as any).close();
  }
});
