import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { SessionData } from 'express-session';
import { AuthGuard } from '@server/auth/guards/auth.guard';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard) // Protect all routes
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query() taskFilterDto: TaskFilterDto,
    @Session() session: SessionData,
  ): Promise<Task[]> {
    const taskFilterData = {
      ...taskFilterDto,
      creatorId: session.userId as number,
    };

    return this.tasksService.findAll(taskFilterData);
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update({ id, ...updateTaskDto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.delete(id);
  }
}
