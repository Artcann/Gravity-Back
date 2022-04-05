import { IsEnum, IsString } from "class-validator";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { Column } from "typeorm";

export class ChallengeTranslationDto {
    @IsEnum(LanguageEnum)
    language: LanguageEnum;

    @IsString()
    title: string;

    @IsString()
    subtitle: string;

    @IsString()
    description: string;

    @IsString()
    rewards: string;
}