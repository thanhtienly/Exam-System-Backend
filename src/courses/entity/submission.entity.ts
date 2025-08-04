import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ForeignKey,
} from 'typeorm';
import { Course } from './course.entity';
import { Exam } from './exam.entity';
import { Question } from './question.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  startedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  endedAt: Date;

  @Column({
    type: 'float',
  })
  score: number;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => User, 'id', {
    onDelete: 'CASCADE',
  })
  userId: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Course, 'id', {
    onDelete: 'CASCADE',
  })
  courseId: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Exam, 'id', {
    onDelete: 'CASCADE',
  })
  examId: string;
}

@Entity('submission_answers')
export class SubmissionAnswer {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  mark: number;

  @Column()
  answer: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Question, 'id', {
    onDelete: 'CASCADE',
  })
  questionId: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Submission, 'id', {
    onDelete: 'CASCADE',
  })
  submissionId: string;
}
