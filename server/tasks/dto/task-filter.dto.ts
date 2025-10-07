import { IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TaskFilterDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  status?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  executor?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  label?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isCreator?: boolean;
}
