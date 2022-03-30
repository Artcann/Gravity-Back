import { IsBoolean, IsString } from "class-validator";

export class CreateSubmissionDto {
    @IsString()
    challengeId: string;

    @IsString()
    content: string;

    @IsBoolean()
    isFile: boolean;

    @IsBoolean()
    acceptToShareImage: boolean;
}