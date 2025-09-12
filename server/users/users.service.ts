import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users...');

    const users = await this.userRepository.findAll();

    this.logger.log(`Found ${users.length} users`);

    return users;
  }

  async findById(id: number): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}...`);

    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    this.logger.log(`Fetching user with email: ${email}...`);

    return this.userRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating new user...');

    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      this.logger.warn(`Email ${createUserDto.email} already exists`);

      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.userRepository.create(createUserDto);

    this.logger.log(`Successfully created user with ID: ${newUser.id}`);

    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}...`);

    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);

      if (existingUser) {
        this.logger.warn(`Email ${updateUserDto.email} already exists`);

        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    if (!updatedUser) {
      this.logger.error(`Failed to update user with ID: ${id}`);

      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.logger.log(`Successfully updated user with ID: ${id}`);

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete user with ID: ${id}`);

    const deletedCount = await this.userRepository.delete(id);
    const isDeleted = deletedCount === 1;

    if (!isDeleted) {
      this.logger.error(`Failed to delete user with ID: ${id}`);

      throw new NotFoundException(`User with ID ${id} not found or already deleted`);
    }

    this.logger.log(`Successfully deleted user with ID: ${id}`);
  }
}
