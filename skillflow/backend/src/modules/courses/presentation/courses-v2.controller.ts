import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCourseUseCase } from '../application/get-course.use-case';
import { Course, CourseSection } from '../domain/course.entity';
import { Public } from '@shared/decorators/public.decorator';

interface CurriculumSection {
  sectionTitle: string;
  lessonCount: number;
  totalDurationMinutes: number;
}

interface CourseStats {
  totalSections: number;
  totalLessons: number;
  totalDurationMinutes: number;
}

interface CourseV2Response {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  published: boolean;
  curriculum: CurriculumSection[];
  stats: CourseStats;
}

@ApiTags('courses-v2')
@Controller({ path: 'courses', version: '2' })
export class CoursesV2Controller {
  constructor(private readonly getCourse: GetCourseUseCase) {}

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CourseV2Response> {
    const result = await this.getCourse.execute(id);
    if (result.isErr()) throw result.error;
    return this.toV2(result.value);
  }

  private parseDurationMinutes(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private toV2(course: Course): CourseV2Response {
    const curriculum: CurriculumSection[] = course.sections.map(
      (section: CourseSection) => {
        const totalDurationMinutes = section.lessons.reduce(
          (sum, lesson) => sum + this.parseDurationMinutes(lesson.duration),
          0,
        );
        return {
          sectionTitle: section.title,
          lessonCount: section.lessons.length,
          totalDurationMinutes,
        };
      },
    );

    const stats: CourseStats = {
      totalSections: curriculum.length,
      totalLessons: curriculum.reduce((sum, s) => sum + s.lessonCount, 0),
      totalDurationMinutes: curriculum.reduce((sum, s) => sum + s.totalDurationMinutes, 0),
    };

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      published: course.published,
      curriculum,
      stats,
    };
  }
}
