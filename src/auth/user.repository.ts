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
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private logger = new Logger('UserRepository');

  async createUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
    // !!TODO this method is very similar to signUp so it could be refactored
    const user = new UserEntity();

    // !! This will delete unwanted fields coming from the @Body()
    // !!TODO check wether class-validator has a built in method to remove those unwanted fields
    const excludedFields: [string] = ['photo'];
    for (let i = 0; i < excludedFields.length; ++i)
      if (createUserDto[excludedFields[i]])
        delete createUserDto[excludedFields[i]];

    // !! After removal of unwanted fields ... Looping through all the expected ones
    // !! and assigning to user: UserEntity the data that came from the @Body()
    for (const x in createUserDto)
      if (createUserDto[x]) user[x] = createUserDto[x];

    // Check if admin provided password for user, otherwise generate a random one
    if (!user.password) user.password = this.genRngPassword();

    const salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(user.password, salt);
    user.passwordConfirm = user.password;

    try {
      await user.save();
    } catch (err) {
      this.logger.error(
        `Failed to save user on signup route. DTO: ${JSON.stringify(
          createUserDto,
        )}`,
        err.stack,
      );

      if (err.code === ErrorCodes.DuplicateField)
        throw new ConflictException('Email already exists!');
      else throw new InternalServerErrorException();
    }

    return {
      message: `${user.name} with role ${user.role} created with success, email sent to ${user.email}`,
    };
  }

  async signUp(
    signUpUserDto: SignUpUserDto,
  ): Promise<{
    name: string;
    role: UserRole;
  }> {
    const user = new UserEntity();

    // !! This will delete unwanted fields coming from the @Body()
    // !!TODO check wether class-validator has a built in method to remove those unwanted fields
    const excludedFields: [string, string] = ['role', 'photo'];
    for (let i = 0; i < excludedFields.length; ++i)
      if (signUpUserDto[excludedFields[i]])
        delete signUpUserDto[excludedFields[i]];

    // !! After removal of unwanted fields ... Looping through all the expected ones
    // !! and assigning to user: UserEntity the data that came from the @Body()
    for (const x in signUpUserDto)
      if (signUpUserDto[x]) user[x] = signUpUserDto[x];

    const salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(user.password, salt);
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

  genRngPassword(): string {
    return (
      Math.random()
        .toString(36)
        .substr(2, 9) +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }
}
