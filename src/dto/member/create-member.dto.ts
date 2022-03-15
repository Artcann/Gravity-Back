import { MemberTranslationDto } from "./member-translation.dto";

export class CreateMemberDto {
    first_name: string;

    last_name: string;

    nickname: string;

    translation: MemberTranslationDto[];
}