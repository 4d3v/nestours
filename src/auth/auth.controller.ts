import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { GetUser } from './get-user.decorator';
import { UserRole } from './user-role.enum';
import { UserEntity } from './user.entity';

@Controller('auth')
export class AuthController {
  logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  // !! This endpoint is intended to be used only by admins to create users such as guide, lead-guide
  @Post('/createuser')
  @UseGuards(AuthGuard())
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @GetUser() user: UserEntity,
  ): Promise<{ message: string }> {
    if (user.role !== UserRole.ADMIN)
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    return this.authService.createUser(createUserDto);
  }

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
