import { IsDataURI, IsDate, IsNotEmpty } from "class-validator";

export class UpdateEventDto {
  @IsNotEmpty()
  title: string;

  short_desc: string;

  long_desc: string;

  image: string;

  @IsDate()
  date: Date;
}