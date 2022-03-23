import { IsEnum, IsString } from "class-validator";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { PresentationEnum } from "src/entities/enums/presentation.enum";

export class CreatePresentationDto {

    @IsEnum(PresentationEnum)
    type: PresentationEnum;

    @IsEnum(LanguageEnum)
    language: LanguageEnum;

    @IsString()
    content: string;
}