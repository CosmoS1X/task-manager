import { Injectable, Logger, ConflictException, ForbiddenException } from '@nestjs/common';
import encrypt from '@server/lib/secure';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';

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

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Fetching user with email: ${email}...`);

    return this.userRepository.findByEmail(email);
  }

  verifyPassword(user: User, password: string): boolean {
    return user.passwordDigest === encrypt(password);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating new user...');

    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      this.logger.warn(`Email ${createUserDto.email} already exists`);

      throw new ConflictException('User with this email already exists');
    }

    const { password, ...restData } = createUserDto;
    const newUser = await this.userRepository.save({
      ...restData,
      passwordDigest: encrypt(password),
    });

    this.logger.log(`Successfully created user with ID: ${newUser.id}`);

    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}...`);

    const user = await this.userRepository.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);

      if (existingUser) {
        this.logger.warn(`Email ${updateUserDto.email} already exists`);

        throw new ConflictException('User with this email already exists');
      }
    }

    const { newPassword, currentPassword, ...restData } = updateUserDto;
    const isPasswordChangeRequested = !!newPassword;
    const isCurrentPasswordProvided = !!currentPassword;
    const isCurrentPasswordValid =
      isCurrentPasswordProvided && this.verifyPassword(user, currentPassword);

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
      ...(newPassword && { passwordDigest: encrypt(newPassword) }),
    };

    const updatedUser = await this.userRepository.patchAndFetch(id, updatedData);

    this.logger.log(`Successfully updated user with ID: ${id}`);

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete user with ID: ${id}`);

    await this.userRepository.deleteById(id);

    this.logger.log(`Successfully deleted user with ID: ${id}`);
  }
}
