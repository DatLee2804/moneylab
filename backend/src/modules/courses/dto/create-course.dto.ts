import { IsString, IsNumber, IsOptional, Min, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  introVideoUrl?: string;

  @IsOptional()
  coverImage?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsBoolean()
  isCombo?: boolean;

  @IsOptional()
  @IsString({ each: true })
  includedCourseIds?: string[];
}
