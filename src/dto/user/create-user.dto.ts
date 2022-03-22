import { Contains, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { LanguageEnum } from "src/entities/enums/language.enum";

export class CreateUserDto {
  @IsEmail()
  @Contains('@eleve.isep.fr')
  email: string;

  password: string;

  username?: string;

  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsPhoneNumber("FR")
  phone_number?: string;
}