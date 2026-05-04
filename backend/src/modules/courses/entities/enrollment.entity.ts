import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';

export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('enrollments')
@Unique(['userId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Course, (course) => course.id)
  course: Course;

  @Column()
  courseId: string;

  @Column({ type: 'int', default: 0 })
  progress: number; // 0-100%

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ENROLLED,
  })
  status: string;

  @CreateDateColumn()
  enrolledAt: Date;
}
