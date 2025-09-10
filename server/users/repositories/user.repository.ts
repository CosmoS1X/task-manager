import { Injectable, ForbiddenException } from '@nestjs/common';
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
    const user = new User();

    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.setPassword(createUserDto.password);

    return this.model.query().insert(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.newPassword) {
      if (!updateUserDto.currentPassword || !user.verifyPassword(updateUserDto.currentPassword)) {
        throw new ForbiddenException({
          error: 'InvalidPassword',
          message: 'Current password is incorrect',
        });
      }

      user.setPassword(updateUserDto.newPassword);
    }

    return user.$query().patchAndFetch(user);
  }
}
