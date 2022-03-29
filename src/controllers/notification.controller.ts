import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
import { RoleEnum } from "src/entities/enums/role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { NotificationService } from "src/services/notification.service";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('all')
    getNotifications(@Request() req) {
        return this.notificationService.getNotificationByUser(req.user.userId, req.user.lang);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Post(':id')
    changeIsNew(@Param('id') id: string) {
        this.notificationService.changeIsNew(id);
    }
}