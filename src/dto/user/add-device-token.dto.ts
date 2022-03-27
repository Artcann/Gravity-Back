import { IsString } from "class-validator";

export class AddDeviceTokenDto {
    @IsString()
    deviceToken: string;
}