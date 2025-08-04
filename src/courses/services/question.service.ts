import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Choice,
  Question,
  QuestionImage,
  Solution,
  Statement,
} from '../entity/question.entity';
import { Exam } from '../entity/exam.entity';

@Injectable()
export class QuestionService {
  private questionRepository: Repository<Question>;
  private choiceRepository: Repository<Choice>;
  private statementRepository: Repository<Statement>;
  private questionImageRepository: Repository<QuestionImage>;
  private solutionRepository: Repository<Solution>;

  constructor(private dataSource: DataSource) {
    this.questionRepository = this.dataSource.getRepository(Question);
    this.choiceRepository = this.dataSource.getRepository(Choice);
    this.statementRepository = this.dataSource.getRepository(Statement);
    this.questionImageRepository = this.dataSource.getRepository(QuestionImage);
    this.solutionRepository = this.dataSource.getRepository(Solution);
  }

  async findExamQuestions(exam: Exam): Promise<Question[]> {
    return await this.questionRepository.find({
      where: {
        examId: exam.id,
      },
      order: {
        type: 'ASC',
        index: 'ASC',
      },
    });
  }

  async saveQuestionList(questionList: Question[]): Promise<Question[]> {
    var savedQuestionList = await this.questionRepository.save(questionList, {
      reload: true,
    });

    return savedQuestionList;
  }

  async saveChoiceList(choiceList: Choice[]): Promise<Choice[]> {
    var savedChoiceList = await this.choiceRepository.save(choiceList, {
      reload: true,
    });
    return savedChoiceList;
  }

  async saveStatementList(statementList: Statement[]): Promise<Statement[]> {
    var savedStatementList = await this.statementRepository.save(statementList);

    return savedStatementList;
  }

  async saveQuestionImageList(
    questionImageList: QuestionImage[],
  ): Promise<QuestionImage[]> {
    var savedQuestionImages =
      await this.questionImageRepository.save(questionImageList);

    return savedQuestionImages;
  }

  async getQuestionAndSolutionCount() {
    var questionCount = await this.questionRepository.count();

    var solutionCount = await this.solutionRepository.count();
    return {
      questions: {
        count: questionCount,
      },
      solutions: {
        count: solutionCount,
      },
    };
  }
}
