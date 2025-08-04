import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateExamDTO } from '../dto/exam.dto';
import { ExamService } from '../services/exam.service';
import { ExtractedQuestion } from '../dto/extract.dto';
import { CourseExam, Exam } from '../entity/exam.entity';
import {
  Choice,
  Question,
  QuestionImage,
  Statement,
} from '../entity/question.entity';
import { QuestionService } from '../services/question.service';
import { ExtractService } from '../services/extract.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/multer.service';
import { unlinkSync } from 'fs';
import { CourseService } from '../services/course.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/role.guard';
import { UserRole } from 'src/users/entity/user.entity';
import { Roles } from 'src/users/guards/roles.decorator';

@Controller('exams')
export class ExamController {
  constructor(
    private readonly courseService: CourseService,
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
    private readonly extractService: ExtractService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get('total')
  async getExamCount(@Res() res: Response) {
    var examCount = await this.examService.getExamCount();

    res.status(200).json({
      success: true,
      data: examCount,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async createExam(
    @UploadedFile() file: Express.Multer.File,
    @Body() createExamData: CreateExamDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    var userId = req['user']['userId'];
    var userRole = req['user']['roles'];
    var course = await this.courseService.findById(createExamData.courseId);

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
      var { fileName, filePath } =
        this.fileUploadService.handleTestQuestionUpload(file);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      var questionList: ExtractedQuestion[] =
        await this.extractService.extractQuestion(fileName);
    } catch (error) {
      unlinkSync(filePath);
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong when processing the file',
      });
    }

    if (questionList.length == 0) {
      return res.status(400).json({
        success: false,
        message:
          "Uploaded file doesn't have any questions or the file format wrong",
      });
    }
    var exam = new Exam(createExamData.title, createExamData.timeLimit);

    var newExamOfCourse = new CourseExam();
    newExamOfCourse.examId = exam.id;
    newExamOfCourse.courseId = createExamData.courseId;

    var lastExamOfCourse = await this.examService.findLastExam(
      createExamData.courseId,
    );

    if (!lastExamOfCourse) {
      newExamOfCourse.index = 0;
    } else {
      newExamOfCourse.index = lastExamOfCourse.index + 1;
    }

    var {
      newQuestionList,
      newChoiceList,
      newStatementList,
      newQuestionImageList,
    } = this.normalizeExamData(questionList, exam.id);

    try {
      await this.examService.createExamWithTransaction(
        newExamOfCourse,
        exam,
        newQuestionList,
        newQuestionImageList,
        newChoiceList,
        newStatementList,
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Create Exam Failed',
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  }

  @Get(':id/questions')
  async getExamQuestion(@Param('id') examId: string, @Res() res: Response) {
    var exam = await this.examService.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Invalid examId',
      });
    }
    var questions = await this.questionService.findExamQuestions(exam);
    res.status(200).json({
      success: true,
      data: questions,
    });
  }

  normalizeExamData(questionList: ExtractedQuestion[], examId: string): any {
    var newQuestionList: Question[] = [];
    var newChoiceList: Choice[] = [];
    var newStatementList: Statement[] = [];
    var newQuestionImageList: QuestionImage[] = [];

    for (let i = 0; i < questionList.length; i++) {
      var newQuestion = new Question(
        questionList[i].index,
        questionList[i].text,
        questionList[i].type,
        examId,
      );
      newQuestionList.push(newQuestion);

      if (questionList[i].images.length) {
        for (let j = 0; j < questionList[i].images.length; j++) {
          const imageName = questionList[i].images[j];
          var questionImage = new QuestionImage(j, imageName, newQuestion.id);
          newQuestionImageList.push(questionImage);
        }
      }

      var choiceList = questionList[i].choices;
      if (choiceList) {
        for (let j = 0; j < choiceList.length; j++) {
          var newChoice = new Choice(j, choiceList[j], newQuestion.id);
          newChoiceList.push(newChoice);
        }
        continue;
      }

      var statementList = questionList[i].statements;
      if (statementList) {
        for (let j = 0; j < statementList.length; j++) {
          var newStatement = new Statement(j, statementList[j], newQuestion.id);
          newStatementList.push(newStatement);
        }
      }
    }

    return {
      newQuestionList,
      newChoiceList,
      newStatementList,
      newQuestionImageList,
    };
  }
}
