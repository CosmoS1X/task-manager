import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Session,
} from '@nestjs/common';
import type { SessionData } from 'express-session';
import { AuthGuard } from '@server/auth/guards/auth.guard';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';

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

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Session() session: SessionData,
  ): Promise<Task> {
    const taskData = {
      ...createTaskDto,
      creatorId: session.userId as number,
    };

    return this.tasksService.create(taskData);
  }
}
