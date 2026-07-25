import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizQuestionDto {
  @ApiProperty({ example: 'What does NestJS stand for?' })
  @IsString()
  text!: string;

  @ApiProperty({ type: [String], example: ['Node Enterprise Standard', 'Node.js Framework', 'Node Express Simplified', 'None of these'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  options!: string[];

  @ApiProperty({ example: 0, description: 'Zero-based index of the correct option' })
  @IsNumber()
  @Min(0)
  correctIndex!: number;
}

export class CreateQuizDto {
  @ApiProperty({ example: 'JavaScript Basics Quiz' })
  @IsString()
  title!: string;

  @ApiProperty({ type: [QuizQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  @ArrayMinSize(1)
  questions!: QuizQuestionDto[];
}
