import { Contains, IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsEmail()
  @Contains('@garageisep.com')
  email: string;

  @IsNotEmpty()
  password: string;
}