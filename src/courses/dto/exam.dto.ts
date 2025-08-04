import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateExamDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumberString()
  @IsNotEmpty()
  timeLimit: number;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}
