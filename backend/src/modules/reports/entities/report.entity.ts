import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: string;

  @ManyToOne(() => User, (user) => user.id)
  reporter: User;

  @Column()
  reporterId: string;

  @ManyToOne(() => User, (user) => user.id)
  reportedUser: User;

  @Column()
  reportedUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}
