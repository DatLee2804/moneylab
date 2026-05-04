import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { TicketType } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(TicketType)
  @IsNotEmpty()
  type: TicketType;
}
