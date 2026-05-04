import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ description: 'Title of the section' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Display order' })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
