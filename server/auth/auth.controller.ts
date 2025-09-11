import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckEmailDto } from './dto/check-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-email')
  async checkEmailAvailability(
    @Query() checkEmailDto: CheckEmailDto,
  ): Promise<{ isAvailable: boolean }> {
    return this.authService.checkEmailAvailability(checkEmailDto.email);
  }
}
