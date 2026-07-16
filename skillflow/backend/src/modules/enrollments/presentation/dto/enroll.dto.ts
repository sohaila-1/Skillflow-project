import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EnrollDto {
  @ApiProperty()
  @IsUUID()
  courseId!: string;
}
