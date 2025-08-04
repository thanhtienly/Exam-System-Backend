import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CourseExam, Exam } from '../entity/exam.entity';
import { CreateExamDTO } from '../dto/exam.dto';
import {
  Choice,
  Question,
  QuestionImage,
  Statement,
} from '../entity/question.entity';
import { QuestionService } from './question.service';
import { Course } from '../entity/course.entity';

@Injectable()
export class ExamService {
  private examRepository: Repository<Exam>;
  private courseExamRepository: Repository<CourseExam>;

  constructor(
    private dataSource: DataSource,
    private readonly questionService: QuestionService,
  ) {
    this.examRepository = this.dataSource.getRepository(Exam);
    this.courseExamRepository = this.dataSource.getRepository(CourseExam);
  }

  async createExamWithTransaction(
    courseExam: CourseExam,
    exam: Exam,
    questionList: Question[],
    questionImageList: QuestionImage[],
    choiceList: Choice[],
    statementList: Statement[],
  ): Promise<Exam> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.examRepository.save(exam, { reload: true });
      await this.questionService.saveQuestionList(questionList);
      await this.questionService.saveQuestionImageList(questionImageList);
      await this.questionService.saveChoiceList(choiceList);
      await this.questionService.saveStatementList(statementList);
      await this.courseExamRepository.save(courseExam, {
        reload: true,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new Error('Create Exam Failed');
    } finally {
      await queryRunner.release();
    }

    return exam;
  }

  async getExamCount() {
    var count = await this.examRepository.count();

    return {
      count: count,
    };
  }

  async findLastExam(courseId: string): Promise<CourseExam | null> {
    return await this.courseExamRepository.findOne({
      where: {
        courseId: courseId,
      },
      order: {
        index: 'DESC',
      },
    });
  }
  async findById(examId: string): Promise<Exam | null> {
    return await this.examRepository.findOne({
      where: {
        id: examId,
      },
    });
  }

  async create(exam: Exam): Promise<Exam> {
    var createdExam = this.examRepository.create(exam);

    createdExam = await this.examRepository.save(createdExam);

    return createdExam;
  }

  async update(exam: Exam): Promise<Exam> {
    const updatedExam = await this.examRepository.save(exam, { reload: true });

    return updatedExam;
  }
}
