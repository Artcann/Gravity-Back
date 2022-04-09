import { IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationActionEnum } from "src/entities/enums/notification-action.enum";

export class CreateNotificationDto {
    @IsString()
    content: string;

    @IsString()
    title: string;

    @IsEnum(NotificationActionEnum)
    action: NotificationActionEnum;

    @IsOptional()
    @IsString()
    url?: string;
}