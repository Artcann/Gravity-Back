import { IsBoolean, IsEnum, IsString, IsUrl } from "class-validator";
import { SocialNetworkEnum } from "src/entities/enums/social-network.enum";

export class AddSocialsDto {
    @IsEnum(SocialNetworkEnum)
    name: SocialNetworkEnum;

    @IsBoolean()
    public: boolean;

    @IsString()
    url: string
}