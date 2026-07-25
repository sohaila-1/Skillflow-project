import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CourseLessonDto {
  @ApiProperty({ example: 'Introduction to Variables' })
  @IsString() @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: '10:30' })
  @IsString() @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ example: 'In this lesson we cover...' })
  @IsString() @IsOptional()
  content?: string;
}

export class CourseSectionDto {
  @ApiProperty({ example: 'Module 1: Getting Started' })
  @IsString() @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ type: [CourseLessonDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseLessonDto)
  @IsOptional()
  lessons?: CourseLessonDto[];
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

  @ApiPropertyOptional({ default: false, description: 'Requires active subscription to enroll' })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;
}
