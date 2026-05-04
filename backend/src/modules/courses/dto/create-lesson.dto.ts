import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ description: 'Title of the lesson' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content/Summary of the lesson', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Video URL (Youtube, Bunny.net, etc.)', required: false })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({ description: 'Duration in minutes', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'Display order', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'Allow free preview', default: false })
  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;
}

export class UpdateLessonDto extends CreateLessonDto {}
