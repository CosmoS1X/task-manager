import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatusesModule } from './statuses/statuses.module';
import { LabelsModule } from './labels/labels.module';
import { TasksModule } from './tasks/tasks.module';

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
export class AppModule {}
