import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExamController } from './controllers/exam.controller';
import { ExamService } from './services/exam.service';
import { QuestionService } from './services/question.service';
import { ExtractService } from './services/extract.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FileUploadService } from './services/multer.service';
import { CourseController } from './controllers/course.controller';
import { UserService } from 'src/users/services/user.service';
import { CourseService } from './services/course.service';
import { QuestionController } from './controllers/question.controller';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MulterModule.register({
      storage: diskStorage({
        destination: path.join(__dirname, '../../src/uploads/docs'),
        filename: (req, file, cb) => {
          const fileName = `${Date.now()} - ${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  ],
  providers: [
    CourseService,
    ExamService,
    QuestionService,
    ExtractService,
    FileUploadService,
    UserService,
  ],
  controllers: [CourseController, ExamController, QuestionController],
})
export class CourseModule {}
