import { Module } from '@nestjs/common';
import { DatabaseModule } from '@server/database/database.module';
import { UserRepository } from '@server/users/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
