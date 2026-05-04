import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommunicationDto {
    @IsUUID()
    @IsNotEmpty()
    receiverId: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
