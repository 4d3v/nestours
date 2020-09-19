import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpUserDto } from './dto/signup-user.dto';

@Controller('auth')
export class AuthController {
  logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) signUpUserDto: SignUpUserDto,
  ): Promise<{
    acessToken: string;
  }> {
    this.logger.verbose(
      `Signing up new User: ${JSON.stringify(signUpUserDto)}`,
    );
    return this.authService.signUp(signUpUserDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{
    acessToken: string;
  }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
