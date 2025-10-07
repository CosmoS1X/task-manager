import { Module } from '@nestjs/common';
import { AuthModule } from '@server/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { StatusRepository } from './repositories/status.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StatusesController],
  providers: [StatusesService, StatusRepository],
  exports: [StatusesService],
})
export class StatusesModule {}
