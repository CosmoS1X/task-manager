import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  name!: string;
}
