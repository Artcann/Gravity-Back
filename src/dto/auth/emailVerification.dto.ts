import { Contains, IsEmail, IsNotEmpty } from "class-validator";

export class EmailVerificationDto {
  @IsEmail()
  @Contains('@eleve.isep.fr')
  @IsNotEmpty()
  email: string;
}