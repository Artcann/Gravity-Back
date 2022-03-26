import { Type } from "class-transformer";
import { IsDataURI, IsOptional, IsString, ValidateNested } from "class-validator";
import { MemberTranslationDto } from "./member-translation.dto";

export class CreateMemberDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    nickname: string;

    @IsOptional()
    @IsDataURI()
    image?: string;

    @ValidateNested()
    @Type(() => MemberTranslationDto)
    translation: MemberTranslationDto[];
}