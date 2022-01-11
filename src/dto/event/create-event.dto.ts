import { IsDate, IsNotEmpty } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  title: string;

  short_desc: string;

  long_desc: string;

  image: string;
  
  @IsDate()
  date: Date;
}