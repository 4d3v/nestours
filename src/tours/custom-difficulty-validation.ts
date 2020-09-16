import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// !! Custom validator to allow users to pass in case insensitive difficulty values
@ValidatorConstraint({ name: 'customText', async: false })
export class CustomDifficultyValidator implements ValidatorConstraintInterface {
  readonly allowedDifficulties = ['easy', 'medium', 'hard'];

  validate(value: string, _args: ValidationArguments) {
    return this.isDifficultyValid(value.toLowerCase());
  }

  defaultMessage(_args: ValidationArguments) {
    return '($value) is an invalid difficulty!, difficulty must be one of the following values: easy, medium, hard';
  }

  private isDifficultyValid(difficulty: any): boolean {
    return this.allowedDifficulties.includes(difficulty);
  }
}
