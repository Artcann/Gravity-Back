import { ApiProperty } from "@nestjs/swagger";
import { Contains, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @Contains('@eleve.isep.fr')
  email: string;

  @IsNotEmpty()
  password: string;

  username?: string;
}