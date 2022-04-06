import { IsEnum, IsOptional, IsString } from "class-validator";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { PresentationEnum } from "src/entities/enums/presentation.enum";

export class UpdatePresentationDto {
    
    @IsOptional()
    @IsEnum(PresentationEnum)
    type: PresentationEnum;

    @IsOptional()
    @IsEnum(LanguageEnum)
    language: LanguageEnum;

    @IsOptional()
    @IsString()
    content: string;
}