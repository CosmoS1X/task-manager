import { Module } from '@nestjs/common';
import { DatabaseModule } from '@server/database/database.module';
import { AuthModule } from '@server/auth/auth.module';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { LabelRepository } from './repositories/label.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [LabelsController],
  providers: [LabelsService, LabelRepository],
  exports: [LabelsService],
})
export class LabelsModule {}
