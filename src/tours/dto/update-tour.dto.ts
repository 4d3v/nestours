import { IsIn, IsOptional } from 'class-validator';
import { TourDifficulty } from '../tour-difficulty.enum';
export class UpdateTourDto {
  name?: string;
  description?: string;
  @IsIn([TourDifficulty.EASY, TourDifficulty.MEDIUM, TourDifficulty.HARD])
  @IsOptional()
  difficulty?: TourDifficulty;
  price?: number;
  duration?: number;
  maxGroupSize?: number;
  summary?: string;
  // imageCover: string;
  // images: string[];
  // startDates: Date[];
}
