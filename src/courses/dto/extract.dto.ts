import { QuestionType } from '../entity/question.entity';

export class ExtractedQuestion {
  index: number;

  text: string;

  type: QuestionType;

  choices?: string[];

  statements?: string[];

  images: string[];
}
