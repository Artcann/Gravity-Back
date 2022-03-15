import { LanguageEnum } from "src/entities/enums/language.enum";

export class MemberTranslationDto {
    language: LanguageEnum;

    isDefault: boolean;

    description: string;
}