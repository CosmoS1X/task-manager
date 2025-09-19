import { Controller, UseGuards, Get, Param, ParseIntPipe, Query, Session } from '@nestjs/common';
import type { SessionData } from 'express-session';
import { AuthGuard } from '@server/auth/guards/auth.guard';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskFilterDto } from './dto/task-filter.dto';

@Controller('tasks')
@UseGuards(AuthGuard) // Protect all routes
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query() taskFilterDto: TaskFilterDto,
    @Session() session: SessionData,
  ): Promise<Task[]> {
    return this.tasksService.findAll(taskFilterDto, session.userId as number);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findById(id);
  }
}
