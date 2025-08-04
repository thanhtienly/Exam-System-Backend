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
import { QuestionService } from '../services/question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('total')
  async getQuestionAndSolutionCount(@Res() res: Response) {
    var questionAndSolutionCount =
      await this.questionService.getQuestionAndSolutionCount();

    res.status(200).json({
      success: true,
      data: questionAndSolutionCount,
    });
  }
}
