import { Type } from "class-transformer";
import { IsBoolean, IsDataURI, IsDate, IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
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

  location_str: string;

  location_title: string;

  location_subtitle: string;

  @IsBoolean()
  open: boolean;

  @IsOptional()
  @IsDataURI()
  image?: string;

  @ValidateNested()
  @Type(() => EventTranslationDto)
  translation: EventTranslationDto[];
}