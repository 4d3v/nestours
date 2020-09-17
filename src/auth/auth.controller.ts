import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { throws } from 'assert';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';

@Controller('auth')
export class AuthController {
  logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpUserDto: SignUpUserDto) {
    this.logger.verbose(
      `Signing up new User: ${JSON.stringify(signUpUserDto)}`,
    );
    return this.authService.signUp(signUpUserDto);
  }
}
