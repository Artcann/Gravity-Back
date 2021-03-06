import { Contains, IsDataURI, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { GroupEnum } from "src/entities/enums/group.enum";
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

  @IsEnum(GroupEnum)
  promo: GroupEnum;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsDataURI()
  profile_picture?: string;
}