import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}