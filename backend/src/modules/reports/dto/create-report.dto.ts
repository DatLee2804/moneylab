import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateReportDto {
  @IsEmail()
  @IsNotEmpty()
  reportedEmail: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
