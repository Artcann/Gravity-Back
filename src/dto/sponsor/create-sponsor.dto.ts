import { Type } from "class-transformer";
import { IsDataURI, IsEnum, IsLatitude, IsLongitude, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
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

    @IsOptional()
    @IsString()
    picture?: string;

    @ValidateNested()
    @Type(() => SponsorTranslationDto)
    translation: SponsorTranslationDto[]
}