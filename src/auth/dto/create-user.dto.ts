import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from '../custom-password-isequal-validation';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsIn([UserRole.ADMIN, UserRole.LEAD_GUIDE, UserRole.GUIDE, UserRole.USER])
  @IsOptional()
  role?: UserRole;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password too weak, must have at least 1 uppercase character, 1 lowercase character and 1 expecial character',
  })
  @IsOptional()
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @IsEqualTo('password') // !! 2: this is another way of adding custom validation with class-validator
  @IsOptional()
  passwordConfirm: string;
}
