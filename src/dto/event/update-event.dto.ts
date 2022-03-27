import { Type } from "class-transformer";
import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { EventTranslationDto } from "./event-translation.dto";

export class UpdateEventDto {

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsLatitude()
  latitude: number;

  @IsOptional()
  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsString()
  short_desc: string;

  @IsOptional()
  @IsString()
  long_desc: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventTranslationDto)
  translation: EventTranslationDto[];
}