import { Type } from "class-transformer";
import { IsBoolean, IsDataURI, IsDate, IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { EventTranslationDto } from "./event-translation.dto";

export class CreateEventDto {
  @IsNotEmpty()
  title: string;
  
  @IsDateString()
  date: Date;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsString()
  location_str: string;

  @IsString()
  location_title: string;

  @IsString()
  location_subtitle: string;

  @IsBoolean()
  open: boolean;

  @IsOptional()
  @IsString()
  image?: string;

  @ValidateNested()
  @Type(() => EventTranslationDto)
  translation: EventTranslationDto[];
}