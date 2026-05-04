import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('course_sections')
export class CourseSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Course, (course) => course.sections)
  course: Course;

  @Column()
  courseId: string;

  @OneToMany(() => Lesson, (lesson) => lesson.section)
  lessons: Lesson[];

  @CreateDateColumn()
  createdAt: Date;
}
