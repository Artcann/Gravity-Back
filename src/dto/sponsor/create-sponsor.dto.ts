import { Type } from "class-transformer";
import { IsEnum, IsLatitude, IsLongitude, IsString, IsUrl, ValidateNested } from "class-validator";
import { SponsorTypeEnum } from "src/entities/enums/sponsor-type.enum";
import { SponsorTranslationDto } from "./sponsor-translation.dto";

export class CreateSponsorDto {
    @IsEnum(SponsorTypeEnum)
    type: SponsorTypeEnum;

    @IsString()
    name: string;

    @IsUrl()
    link: string

    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;

    @ValidateNested()
    @Type(() => SponsorTranslationDto)
    translation: SponsorTranslationDto[]
}