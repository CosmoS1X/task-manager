import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { StatusRepository } from './repositories/status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService, StatusRepository],
  exports: [StatusesService],
})
export class StatusesModule {}
