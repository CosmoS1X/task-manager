import { Module } from '@nestjs/common';
import { DatabaseModule } from '@server/database/database.module';
import { UsersService } from '@server/users/users.service';
import { UserRepository } from '@server/users/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { OwnerGuard } from './guards/owner.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UserRepository, AuthGuard, OwnerGuard],
  exports: [AuthService, AuthGuard, OwnerGuard],
})
export class AuthModule {}
