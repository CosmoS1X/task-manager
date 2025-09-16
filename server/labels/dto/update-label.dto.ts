import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateLabelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;
}
