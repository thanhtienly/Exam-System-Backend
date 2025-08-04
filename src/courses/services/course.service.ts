import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Course, CourseType } from '../entity/course.entity';
import { CourseExam } from '../entity/exam.entity';
import { User } from 'src/users/entity/user.entity';
import { Enrollment } from '../entity/enrollment.entity';

@Injectable()
export class CourseService {
  private courseRepository: Repository<Course>;
  private enrollmentRepository: Repository<Enrollment>;

  constructor(private dataSource: DataSource) {
    this.courseRepository = this.dataSource.getRepository(Course);
    this.enrollmentRepository = this.dataSource.getRepository(Enrollment);
  }

  async create(course: Course): Promise<Course> {
    var newCourse = this.courseRepository.create(course);

    return await this.courseRepository.save(newCourse, {
      reload: true,
    });
  }

  async findById(courseId: string): Promise<Course | null> {
    return await this.courseRepository.findOne({
      where: {
        id: courseId,
      },
    });
  }

  async update(course: Course): Promise<Course> {
    return await this.courseRepository.save(course);
  }

  async delete(course: Course): Promise<Course> {
    return await this.courseRepository.remove(course);
  }

  async getCoursesInfo(
    take: number = 0,
    skip: number = 0,
    queryOptions?: {
      authorId?: string;
    },
  ): Promise<Course[]> {
    var query = this.courseRepository.createQueryBuilder('courses');

    if (queryOptions?.authorId) {
      query = query.where(`courses.userId = :authorId`, {
        authorId: queryOptions.authorId,
      });
    }

    return await query
      .leftJoin(
        CourseExam,
        'course_exams',
        'course_exams.courseId = courses.id',
      )
      .leftJoin(User, 'users', 'courses.userId = users.id')
      .addSelect('courses.id', 'id')
      .addSelect('courses.title', 'title')
      .addSelect('courses.description', 'description')
      .addSelect('courses.type', 'type')
      .addSelect('courses.createdAt', 'createdAt')
      .addSelect('courses.updatedAt', 'updatedAt')
      .addSelect('courses.userId', 'authorId')
      .addSelect("CONCAT(users.lastName, ' ', users.firstName)", 'authorName')
      .addSelect('COUNT(course_exams.id)', 'examCount')
      .groupBy('courses.id')
      .orderBy('courses.createdAt', 'DESC')
      .offset(skip)
      .limit(take)
      .getRawMany();
  }

  async getCourseCount() {
    var publicCourseCount = await this.courseRepository.count({
      where: {
        type: CourseType.PUBLIC,
      },
    });

    var privateCourseCount = await this.courseRepository.count({
      where: {
        type: CourseType.PRIVATE,
      },
    });

    return {
      private: {
        count: privateCourseCount,
      },
      public: {
        count: publicCourseCount,
      },
    };
  }

  async getCourseParticipantCount(courseId: string) {
    var participantCount = await this.enrollmentRepository.count({
      where: {
        courseId: courseId,
      },
    });
    return {
      participants: {
        count: participantCount,
      },
    };
  }
}
