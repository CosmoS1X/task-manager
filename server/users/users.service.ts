import { Injectable, Logger, ConflictException, ForbiddenException } from '@nestjs/common';
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
    const { newPassword, currentPassword, ...restData } = userUpdateData;

    this.logger.log(`Updating user with ID: ${userUpdateData.id}...`);

    const user = await this.findById(userUpdateData.id);

    if (userUpdateData.email && userUpdateData.email !== user.email) {
      const existingUser = await this.findByEmail(userUpdateData.email);

      if (existingUser) {
        this.logger.warn(`Email ${userUpdateData.email} already exists`);

        throw new ConflictException('User with this email already exists');
      }
    }

    const isPasswordChangeRequested = !!newPassword;
    const isCurrentPasswordProvided = !!currentPassword;
    const isCurrentPasswordValid = isCurrentPasswordProvided
      && user.verifyPassword(currentPassword);

    if (isPasswordChangeRequested && !isCurrentPasswordProvided) {
      throw new ForbiddenException({
        error: 'CurrentPasswordRequired',
        message: 'Current password is required to change password',
      });
    }

    if (isPasswordChangeRequested && !isCurrentPasswordValid) {
      throw new ForbiddenException({
        error: 'InvalidPassword',
        message: 'Current password is incorrect',
      });
    }

    const updatedData = {
      ...restData,
      ...newPassword && { password: newPassword },
    };

    const updatedUser = await this.userRepository.update(updatedData);

    this.logger.log(`Successfully updated user with ID: ${userUpdateData.id}`);

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete user with ID: ${id}`);

    await this.userRepository.delete(id);

    this.logger.log(`Successfully deleted user with ID: ${id}`);
  }
}
