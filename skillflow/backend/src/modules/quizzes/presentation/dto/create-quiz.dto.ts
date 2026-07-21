import { IsString, IsArray, ValidateNested, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizQuestionDto {
  @IsString()
  text!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  options!: string[];

  @IsNumber()
  @Min(0)
  correctIndex!: number;
}

export class CreateQuizDto {
  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  @ArrayMinSize(1)
  questions!: QuizQuestionDto[];
}
