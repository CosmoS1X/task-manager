import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatusesModule } from './statuses/statuses.module';
import { LabelsModule } from './labels/labels.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    AuthModule,
    StatusesModule,
    LabelsModule,
    TasksModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*path');
  }
}
