import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  name!: string;
}
