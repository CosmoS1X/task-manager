import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;
}
