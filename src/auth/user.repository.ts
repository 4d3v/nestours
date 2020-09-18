import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorCodes } from 'src/utils/error-codes.enum';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRole } from './user-role.enum';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private logger = new Logger('UserRepository');

  async signUp(
    signUpUserDto: SignUpUserDto,
  ): Promise<{
    name: string;
    role: UserRole;
  }> {
    const user = new UserEntity();
    for (const x in signUpUserDto)
      if (signUpUserDto[x]) user[x] = signUpUserDto[x];

    const salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(signUpUserDto.password, salt);
    user.passwordConfirm = user.password;
    // delete user.passwordConfirm;

    // !---------------------------------------------------------------------------------!
    // ! TODO: Check if it's best to delete passwordConfirm from db and leave it as null !
    // ! or store the same hashed user.password on that                                  !
    // !---------------------------------------------------------------------------------!

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

    return { name: user.name, role: user.role };
  }

  async validateUserPassword({
    email,
    password,
  }: AuthCredentialsDto): Promise<{ name: string; role: UserRole }> {
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password)))
      return { name: user.name, role: user.role };
    else return undefined;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
