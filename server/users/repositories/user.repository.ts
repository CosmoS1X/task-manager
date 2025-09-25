import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserCreateData extends CreateUserDto {}

export interface UserUpdateData extends UpdateUserDto {
  id: number;
}

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected model = User;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.model.query().findOne({ email });
  }

  async create(userCreateData: UserCreateData): Promise<User> {
    const existingUser = await this.findByEmail(userCreateData.email);

    if (existingUser) {
      throw new ConflictException({
        error: 'UserAlreadyExists',
        message: 'User with this email already exists',
      });
    }

    return this.model.query().insertAndFetch(userCreateData);
  }

  async update(userUpdateData: UserUpdateData): Promise<User> {
    const { id, newPassword, currentPassword, ...userFields } = userUpdateData;

    const user = await this.findById(id);

    const isPasswordChangeRequested = !!newPassword;
    const isCurrentPasswordProvided = !!currentPassword;
    const isCurrentPasswordValid = isCurrentPasswordProvided
      && user.verifyPassword(currentPassword);

    if (isPasswordChangeRequested && !isCurrentPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const updatedData = {
      ...userFields,
      ...newPassword && { password: newPassword },
    };

    return user.$query().patchAndFetch(updatedData);
  }
}
