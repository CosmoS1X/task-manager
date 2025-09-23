import { IsString, MaxLength, IsOptional, IsNumber, Min, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateTaskDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  statusId?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => value || null)
  executorId?: number | null;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  labelIds?: number[];
}
