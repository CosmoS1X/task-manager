import { Injectable } from '@nestjs/common';
import { UserRepository } from '@server/users/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async checkEmailAvailability(email: string): Promise<{ isAvailable: boolean }> {
    const user = await this.userRepository.findByEmail(email);

    return { isAvailable: !user };
  }
}
