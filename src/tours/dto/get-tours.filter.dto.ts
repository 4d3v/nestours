import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TourDifficulty } from '../tour-difficulty.enum';

export class GetToursFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsIn([TourDifficulty.EASY, TourDifficulty.MEDIUM, TourDifficulty.HARD])
  difficulty: TourDifficulty;

  // TODO -> apply for other properties such as price: number;
}
