import {
  BeforeInsert,
  Column,
  Entity,
  ForeignKey,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './exam.entity';
import { v4 as uuid_v4 } from 'uuid';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_BLANK = 'fill_blank',
  STATEMENT = 'statement',
}

@Entity('questions')
export class Question {
  constructor(index: number, text: string, type: QuestionType, examId: string) {
    this.id = uuid_v4();
    this.index = index;
    this.text = text;
    this.type = type;
    this.examId = examId;
  }

  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column()
  type: QuestionType;

  @Column({
    type: 'int',
  })
  index: number;

  @Column({
    type: 'float',
  })
  point: number;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Exam, 'id', {
    onDelete: 'CASCADE',
  })
  examId: string;

  @BeforeInsert()
  setDefaultPoint() {
    switch (this.type) {
      case QuestionType.MULTIPLE_CHOICE:
        this.point = 0.25;
        break;
      case QuestionType.STATEMENT:
        this.point = 1;
        break;
      case QuestionType.FILL_BLANK:
        this.point = 0.5;
    }
  }
}

@Entity('choices')
export class Choice {
  constructor(index: number, text: string, questionId: string) {
    this.index = index;
    this.text = text;
    this.questionId = questionId;
  }

  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'int',
  })
  index: number;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Question, 'id', {
    onDelete: 'CASCADE',
  })
  questionId: string;
}

@Entity('statements')
export class Statement {
  constructor(index: number, text: string, questionId: string) {
    this.index = index;
    this.text = text;
    this.questionId = questionId;
  }

  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column()
  index: number;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Question, 'id', {
    onDelete: 'CASCADE',
  })
  questionId: string;
}

@Entity('question_answers')
export class QuestionAnswer {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  answer: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Question, 'id', {
    onDelete: 'CASCADE',
  })
  questionId: string;
}

@Entity('question_images')
export class QuestionImage {
  constructor(index: number, url: string, questionId: string) {
    this.index = index;
    this.url = url;
    this.questionId = questionId;
  }

  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  index: number;

  @Column()
  url: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Question, 'id', {
    onDelete: 'CASCADE',
  })
  questionId: string;
}

@Entity('solutions')
export class Solution {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'int',
  })
  index: number;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Question, 'id', {
    onDelete: 'CASCADE',
  })
  questionId: string;
}

@Entity('solution_images')
export class SolutionImage {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  index: number;

  @Column()
  url: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Solution, 'id', {
    onDelete: 'CASCADE',
  })
  solutionId: string;
}
