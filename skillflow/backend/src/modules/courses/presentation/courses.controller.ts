import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';
import { CreateCourseUseCase } from '../application/create-course.use-case';
import { ListCoursesUseCase } from '../application/list-courses.use-case';
import { GetCourseUseCase } from '../application/get-course.use-case';
import { UpdateCourseUseCase } from '../application/update-course.use-case';
import { DeleteCourseUseCase } from '../application/delete-course.use-case';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';
import { Public } from '@shared/decorators/public.decorator';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly createCourse: CreateCourseUseCase,
    private readonly listCourses: ListCoursesUseCase,
    private readonly getCourse: GetCourseUseCase,
    private readonly updateCourse: UpdateCourseUseCase,
    private readonly deleteCourse: DeleteCourseUseCase,
  ) {}

  @Public()
  @Get()
  async findAll() {
    const result = await this.listCourses.execute();
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.getCourse.execute(id);
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Post()
  @Roles('instructor', 'admin')
  async create(@Body() dto: CreateCourseDto, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.createCourse.execute(dto, user.sub);
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Patch(':id')
  @Roles('instructor', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.updateCourse.execute(id, dto, user.sub);
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('instructor', 'admin')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.deleteCourse.execute(id, user.sub);
    if (result.isErr()) throw result.error;
  }
}
