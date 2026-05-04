import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { CourseSection } from './section.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // Duration in minutes

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: false })
  isPreview: boolean; // NEW: Lesson-level preview toggle

  @ManyToOne(() => CourseSection, (section) => section.lessons)
  section: CourseSection;

  @Column()
  sectionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
