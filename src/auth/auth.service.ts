import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto) {
    // !! it will return a jwt token in future
    return await this.userRepository.signUp(signUpUserDto);
  }
}
