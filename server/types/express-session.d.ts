import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    destroy(callback: (error: Error) => void): void;
  }
}
