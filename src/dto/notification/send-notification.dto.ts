import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { GroupEnum } from "src/entities/enums/group.enum";

export class SendNotificationDto {
    @IsString()
    notificationId: string;

    @IsOptional()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsEnum(GroupEnum)
    group: GroupEnum
}