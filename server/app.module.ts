import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatusesModule } from './statuses/statuses.module';
import { LabelsModule } from './labels/labels.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    StatusesModule,
    LabelsModule,
    TasksModule,
  ],
})
export class AppModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*path');
  }
}
