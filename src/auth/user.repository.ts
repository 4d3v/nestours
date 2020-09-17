import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorCodes } from 'src/utils/error-codes.enum';
import { EntityRepository, Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private logger = new Logger('UserRepository');

  async signUp(signUpUserDto: SignUpUserDto) {
    const user = new UserEntity();
    for (const x in signUpUserDto)
      if (signUpUserDto[x]) user[x] = signUpUserDto[x];

    try {
      await user.save();
    } catch (err) {
      this.logger.error(
        `Failed to save user on signup route. DTO: ${JSON.stringify(
          signUpUserDto,
        )}`,
        err.stack,
      );

      if (err.code === ErrorCodes.DuplicateField)
        throw new ConflictException('Email already exists!');
      else throw new InternalServerErrorException();
    }

    return user;
  }
}
