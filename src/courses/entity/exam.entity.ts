import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  BeforeUpdate,
  ForeignKey,
} from 'typeorm';
import { Course } from './course.entity';
import { v4 as uuid_v4 } from 'uuid';

@Entity('exams')
export class Exam {
  constructor(title: string, timeLimit: number) {
    this.id = uuid_v4();
    this.title = title;
    this.timeLimit = timeLimit;
  }

  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  timeLimit: number;

  @Column({
    type: 'timestamp',
    default: () => `(CURRENT_TIMESTAMP)`,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => `(CURRENT_TIMESTAMP)`,
  })
  updatedAt: Date;

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}

@Entity('course_exams')
export class CourseExam {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'int',
  })
  index: number;

  @Column({
    type: 'timestamp',
    default: () => `(CURRENT_TIMESTAMP)`,
  })
  createdAt: Date;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Exam, 'id', {
    onDelete: 'CASCADE',
  })
  examId: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Course, 'id', {
    onDelete: 'CASCADE',
  })
  courseId: string;
}
