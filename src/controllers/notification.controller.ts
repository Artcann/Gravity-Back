import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
import { CreateNotificationDto } from "src/dto/notification/create-notification.dto";
import { SendNotificationDto } from "src/dto/notification/send-notification.dto";
import { GroupEnum } from "src/entities/enums/group.enum";
import { RoleEnum } from "src/entities/enums/role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { NotificationService } from "src/services/notification.service";
import { UserService } from "src/services/user.service";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService, private userService: UserService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get(':id/:deviceToken')
    sendNotificationToDevice(@Param('id') notificationId: string, @Param('deviceToken') deviceToken: string) {
        return this.notificationService.sendNotificationToDevice(notificationId, deviceToken);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get(':notificationId/user/:userId')
    async sendNotificationToUser(@Param('notificationId') notificationId: string, @Param('userId') userId: string) {
        const user = await this.userService.findOneById(userId);
        console.log(user);
        return this.notificationService.sendNotificationToDevice(notificationId, user.deviceToken)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('all')
    getNotifications(@Request() req) {
        return this.notificationService.getNotificationByUser(req.user.userId, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('all/admin')
    getAllNotifications() {
        return this.notificationService.getNotifications();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Post("send/group")
    sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
        if(sendNotificationDto.group !== undefined) {
            this.notificationService.sendNotificationToGroup(sendNotificationDto.notificationId, sendNotificationDto.group);
        }
        
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Post("create")
    createNotification(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Post(':id')
    changeIsNew(@Param('id') id: string) {
        return this.notificationService.changeIsNew(id);
    }
}