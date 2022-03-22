import { IsBoolean, IsEnum, IsString } from "class-validator";
import { LanguageEnum } from "src/entities/enums/language.enum";

export class MemberTranslationDto {
    @IsEnum(LanguageEnum)
    language: LanguageEnum;

    @IsBoolean()
    isDefault: boolean;

    @IsString()
    description: string;
}