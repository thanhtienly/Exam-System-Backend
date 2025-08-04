import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/role.guard';
import { Roles } from 'src/users/guards/roles.decorator';
import { UserRole } from 'src/users/entity/user.entity';
import { CreateCourseDTO } from '../dto/course.dto';
import { Request, Response } from 'express';
import { Course, CourseType } from '../entity/course.entity';
import { UserService } from 'src/users/services/user.service';
import { CourseService } from '../services/course.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}

  @Get('total')
  async getCourseCount(@Res() res: Response) {
    var courseCount = await this.courseService.getCourseCount();

    console.log(courseCount);
    res.status(200).json({
      success: true,
      data: courseCount,
    });
  }

  @Get(':id/enrollments/total')
  async getCourseParticipantCount(
    @Param('id') courseId: string,
    @Res() res: Response,
  ) {}

  @Get('public')
  async getPublicCourses(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Res() res: Response,
    @Query('authorId') authorId?: string,
  ) {
    var courses = await this.courseService.getCoursesInfo(limit, skip, {
      authorId: authorId,
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get('private')
  async getPrivateCourses(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    var userId = req['user']['userId'];
    var userRole = req['user']['roles'];

    if (userRole == UserRole.ADMIN) {
      var courses = await this.courseService.getCoursesInfo(limit, skip);
      return res.status(200).json({
        success: true,
        data: courses,
      });
    }

    var courses = await this.courseService.getCoursesInfo(limit, skip, {
      authorId: userId,
    });
    res.status(200).json({
      success: true,
      data: courses,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Post('create')
  async createCourse(
    @Body() createCourseData: CreateCourseDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    var userId = req['user']['userId'];
    var course = new Course(
      createCourseData.title,
      createCourseData.description,
      createCourseData.isPublic,
      userId,
    );
    try {
      course = await this.courseService.create(course);
      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong when creating course',
      });
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Post(':id')
  async updateCourse(
    @Body() updateCourseData: CreateCourseDTO,
    @Param('id') courseId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    var userId = req['user']['userId'];
    var userRole = req['user']['roles'];
    var course = await this.courseService.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.userId != userId && userRole == UserRole.TEACHER) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    course.title = updateCourseData.title;
    course.description = updateCourseData.description;
    course.type = updateCourseData.isPublic
      ? CourseType.PUBLIC
      : CourseType.PRIVATE;

    course = await this.courseService.update(course);

    res.status(200).json({
      success: true,
      data: course,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Delete(':id')
  async deleteCourse(
    @Param('id') courseId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    var userId = req['user']['userId'];
    var userRole = req['user']['roles'];
    var course = await this.courseService.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.userId != userId && userRole == UserRole.TEACHER) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    try {
      course = await this.courseService.delete(course);
      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong when deleting course',
      });
    }
  }
}
