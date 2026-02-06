import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './entities/label.entity';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { LabelRepository } from './repositories/label.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  controllers: [LabelsController],
  providers: [LabelsService, LabelRepository],
  exports: [LabelsService],
})
export class LabelsModule {}
