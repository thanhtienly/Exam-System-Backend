import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  createdAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerify: boolean;

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  verifiedAt: Date;
}
