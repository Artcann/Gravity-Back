import { Type } from "class-transformer";
import { Contains, IsDataURI, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";
import { GroupEnum } from "src/entities/enums/group.enum";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { SocialNetwork } from "src/entities/social-network.entity";

export class UpdateUserDto {
    @IsOptional()
    password?: string;

    @IsOptional()
    username?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsPhoneNumber("FR")
    phone_number?: string;

    @IsOptional()
    @IsEnum(LanguageEnum)
    language?: string;

    @IsOptional()
    @IsEnum(GroupEnum)
    group?: GroupEnum;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsString()
    profile_picture?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SocialNetwork)
    socials: SocialNetwork[];
}