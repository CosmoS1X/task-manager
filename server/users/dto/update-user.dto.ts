import { IsString, MinLength, MaxLength, IsOptional, IsEmail, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(255)
  @ValidateIf(({ newPassword }) => newPassword !== undefined)
  currentPassword?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  newPassword?: string;
}
