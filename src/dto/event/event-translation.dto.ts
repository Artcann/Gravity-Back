import { LanguageEnum } from "src/entities/enums/language.enum";

export class EventTranslationDto {
    
    language: LanguageEnum;
    
    isDefault: boolean;

    short_desc?: string;

    long_desc?: string;

    title: string;
}