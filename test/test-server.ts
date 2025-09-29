import { Server } from 'http';
import { getNestApp } from './nest-app-factory';

export const getTestServer = async (): Promise<Server> => {
  const app = await getNestApp();

  return app.getHttpServer();
};
