import { IsBoolean, IsEnum } from "class-validator";
import { LanguageEnum } from "src/entities/enums/language.enum";

export class EventTranslationDto {
    
    @IsEnum(LanguageEnum)
    language: LanguageEnum;
    
    @IsBoolean()
    isDefault: boolean;

    short_desc?: string;

    long_desc?: string;

    title: string;
}