import { Contains, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @Contains('@eleve.isep.fr')
  email: string;

  password: string;

  username?: string;
}