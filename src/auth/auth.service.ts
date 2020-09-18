import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpUserDto: SignUpUserDto,
  ): Promise<{
    acessToken: string;
  }> {
    // !! At this point user should already have been created
    // !! if anything goes wrong this.repository.signUp will catch and throw error
    const user = await this.userRepository.signUp(signUpUserDto);
    const { name, role } = user;
    const payload: JwtPayload = { name, role };
    const acessToken = this.jwtService.sign(payload);
    return { acessToken };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{
    acessToken: string;
  }> {
    const authUser = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!authUser) throw new UnauthorizedException('Invalid credentials');

    const { name, role } = authUser;
    const payload: JwtPayload = { name, role };
    const acessToken = this.jwtService.sign(payload);
    return { acessToken };
  }
}