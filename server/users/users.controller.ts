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
  Session,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import type { SessionData } from 'express-session';
import { AuthService } from '@server/auth/auth.service';
import { AuthGuard } from '@server/auth/guards/auth.guard';
import { OwnerGuard } from '@server/auth/guards/owner.guard';
import { Public } from '@server/auth/decorators/public.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard) // Protect all routes by default
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(OwnerGuard) // Only allow owners to access their profile
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @Public() // Allow unauthenticated access for user creation
  async create(
    @Body() createUserDto: CreateUserDto,
    @Session() session: SessionData,
  ): Promise<User> {
    const user = await this.usersService.create(createUserDto);

    await this.authService.login(user.id, session);

    return user;
  }

  @Patch(':id')
  @UseGuards(OwnerGuard) // Only allow owners to update their profile
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({ id, ...updateUserDto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnerGuard) // Only allow owners to delete their profile
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.usersService.delete(id);
    await this.authService.logout(session, res);
  }
}
