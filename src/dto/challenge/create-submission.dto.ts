import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateSubmissionDto {
    @IsNumber()
    challengeId: number;

    @IsString()
    content: string;

    @IsBoolean()
    isFile: boolean;

    @IsBoolean()
    acceptToShareImage: boolean;
}