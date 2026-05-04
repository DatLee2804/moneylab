import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../../users/entities/user.entity';
import { CourseSection } from './section.entity';

export enum CourseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ default: false })
  isFree: boolean; // NEW: Course-level pricing toggle

  @Column()
  category: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.PENDING,
  })
  status: string;

  @ManyToOne(() => User, (user) => user.courses)
  instructor: User;

  @Column()
  instructorId: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => CourseSection, (section) => section.course)
  sections: CourseSection[];

  @CreateDateColumn()
  createdAt: Date;
}
