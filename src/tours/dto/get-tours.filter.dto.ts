import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { CustomDifficultyValidator } from '../custom-difficulty-validation';
import { TourDifficulty } from '../tour-difficulty.enum';

export class GetToursFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @Validate(CustomDifficultyValidator) // !! 1: this is one way of adding custom validation with class-validator
  difficulty: TourDifficulty;

  // TODO -> apply for other properties such as price: number;
}
