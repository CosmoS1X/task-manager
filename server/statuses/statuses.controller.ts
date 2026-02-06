import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@server/auth/guards/auth.guard';
import { StatusesService } from './statuses.service';
import { Status } from './entities/status.entity';
import { CreateStatusDto, UpdateStatusDto } from './dto';

@Controller('statuses')
@UseGuards(AuthGuard) // Protect all routes
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get()
  async findAll(): Promise<Status[]> {
    return this.statusesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Status> {
    return this.statusesService.findById(id);
  }

  @Post()
  async create(@Body() createStatusDto: CreateStatusDto): Promise<Status> {
    return this.statusesService.create(createStatusDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Status> {
    return this.statusesService.update(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.statusesService.delete(id);
  }
}
