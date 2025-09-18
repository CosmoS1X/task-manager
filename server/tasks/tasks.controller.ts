import { Controller, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@server/auth/guards/auth.guard';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Controller('tasks')
@UseGuards(AuthGuard) // Protect all routes
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findById(id);
  }
}
