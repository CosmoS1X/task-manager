import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected model = User;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.model.query().findOne({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException({
        error: 'UserAlreadyExists',
        message: 'User with this email already exists',
      });
    }

    return this.model.query().insertAndFetch(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const { newPassword, currentPassword, ...userFields } = updateUserDto;

    if (newPassword && (!currentPassword || !user.verifyPassword(currentPassword))) {
      throw new ForbiddenException({
        error: 'InvalidPassword',
        message: 'Current password is incorrect',
      });
    }

    const updatedData = {
      ...userFields,
      ...(newPassword && { password: newPassword }),
    };

    return user.$query().patchAndFetch(updatedData);
  }
}
