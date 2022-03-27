import { Type } from "class-transformer";
import { IsEnum, IsLatitude, IsLongitude, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { SponsorTypeEnum } from "src/entities/enums/sponsor-type.enum";
import { SponsorTranslationDto } from "./sponsor-translation.dto";

export class UpdateSponsorDto {

    @IsOptional()
    @IsEnum(SponsorTypeEnum)
    type?: SponsorTypeEnum;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsUrl()
    link?: string

    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @IsOptional()
    @IsString()
    picture?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SponsorTranslationDto)
    translation?: SponsorTranslationDto[]
}