import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// !! This pipe is currently not being used
// !! Replaced with CustomDifficultyValidator Decorator
@Injectable()
export class TourDifficultyValidationPipe implements PipeTransform {
  readonly allowedDifficulties = ['easy', 'medium', 'hard'];

  transform(value: any) {
    if (value) {
      value = value.toLowerCase();

      if (!this.isDifficultyValid(value))
        throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }

  private isDifficultyValid(difficulty: any): boolean {
    return this.allowedDifficulties.includes(difficulty);
  }
}
