import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ForeignKey,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  enrolledAt: Date;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => User, 'id')
  userId: string;

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => Course, 'id')
  courseId: string;
}
