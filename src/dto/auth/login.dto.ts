import { Contains, IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsEmail()
  @Contains('@eleve.isep.fr')
  email: string;

  @IsNotEmpty()
  password: string;
}