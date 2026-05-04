import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TicketType {
  TECHNICAL = 'TECHNICAL',
  BILLING = 'BILLING',
  OTHER = 'OTHER',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.OTHER,
  })
  type: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: string;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @Column()
  senderId: string;

  @CreateDateColumn()
  createdAt: Date;
}
