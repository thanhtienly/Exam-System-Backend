import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  BeforeUpdate,
  ForeignKey,
} from 'typeorm';

export enum CourseType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('courses')
export class Course {
  constructor(
    title: string,
    description: string,
    isPublic: boolean,
    teacherId: string,
  ) {
    this.title = title;
    this.description = description;
    this.type = isPublic ? CourseType.PUBLIC : CourseType.PRIVATE;
    this.userId = teacherId;
  }

  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: CourseType,
    default: CourseType.PUBLIC,
  })
  type: CourseType;

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

  @Column({
    type: 'uuid',
  })
  @ForeignKey(() => User, 'id')
  userId: string;

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
