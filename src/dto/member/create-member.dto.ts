import { Type } from "class-transformer";
import { IsDataURI, IsOptional, IsString, ValidateNested } from "class-validator";
import { MemberTranslationDto } from "./member-translation.dto";

export class CreateMemberDto {
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    nickname: string;

    @IsString()
    image: string;

    @IsString()
    role: string;

    @ValidateNested()
    @Type(() => MemberTranslationDto)
    translation: MemberTranslationDto[];
}