import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, Min } from 'class-validator';

export class SubmitQuizDto {
  @ApiProperty({ type: [Number], example: [0, 2, 1], description: 'Zero-based index of the selected answer for each question' })
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  answers!: number[];
}
