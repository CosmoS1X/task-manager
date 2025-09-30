import { Injectable } from '@nestjs/common';
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
    return this.model.query().insertAndFetch(userCreateData);
  }

  async update(userUpdateData: UserUpdateData): Promise<User> {
    const { id, ...userFields } = userUpdateData;

    const user = await this.findById(id);

    return user.$query().patchAndFetch(userFields);
  }
}
