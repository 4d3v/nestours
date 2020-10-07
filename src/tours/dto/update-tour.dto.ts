import { IsIn, IsOptional } from 'class-validator';
import { TourDifficulty } from '../tour-difficulty.enum';
export class UpdateTourDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsIn([TourDifficulty.EASY, TourDifficulty.MEDIUM, TourDifficulty.HARD])
  @IsOptional()
  difficulty?: TourDifficulty;

  @IsOptional()
  price?: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  maxGroupSize?: number;

  @IsOptional()
  summary?: string;

  // imageCover: string;
  // images: string[];
  // startDates: Date[];
}
