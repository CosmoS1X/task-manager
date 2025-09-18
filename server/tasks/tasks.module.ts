import { Module } from '@nestjs/common';
import { DatabaseModule } from '@server/database/database.module';
import { AuthModule } from '@server/auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  exports: [TasksService],
})
export class TasksModule {}
