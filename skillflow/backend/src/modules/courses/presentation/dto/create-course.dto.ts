import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsArray, ValidateNested, IsIn, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CourseSectionDto {
  @IsString() @IsNotEmpty()
  title!: string;

  @IsIn(['youtube', 'pdf'])
  type!: 'youtube' | 'pdf';

  @IsUrl()
  url!: string;
}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ default: 'General' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ default: 'Beginner', enum: ['Beginner', 'Intermediate', 'Advanced'] })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({ type: [CourseSectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseSectionDto)
  @IsOptional()
  sections?: CourseSectionDto[];

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
