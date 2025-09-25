import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository, UserCreateData, UserUpdateData } from './repositories/user.repository';

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

  async create(userCreateData: UserCreateData): Promise<User> {
    this.logger.log('Creating new user...');

    const existingUser = await this.findByEmail(userCreateData.email);

    if (existingUser) {
      this.logger.warn(`Email ${userCreateData.email} already exists`);

      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.userRepository.create(userCreateData);

    this.logger.log(`Successfully created user with ID: ${newUser.id}`);

    return newUser;
  }

  async update(userUpdateData: UserUpdateData): Promise<User> {
    this.logger.log(`Updating user with ID: ${userUpdateData.id}...`);

    const user = await this.findById(userUpdateData.id);

    if (userUpdateData.email && userUpdateData.email !== user.email) {
      const existingUser = await this.findByEmail(userUpdateData.email);

      if (existingUser) {
        this.logger.warn(`Email ${userUpdateData.email} already exists`);

        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = await this.userRepository.update(userUpdateData);

    this.logger.log(`Successfully updated user with ID: ${userUpdateData.id}`);

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete user with ID: ${id}`);

    const deletedRows = await this.userRepository.delete(id);

    if (deletedRows === 0) {
      this.logger.error(`Failed to delete user with ID: ${id}`);

      throw new NotFoundException(`User with ID ${id} not found or already deleted`);
    }

    this.logger.log(`Successfully deleted user with ID: ${id}`);
  }
}
