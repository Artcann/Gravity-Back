import { LanguageEnum } from 'src/entities/enums/language.enum';
import { IsEnum } from 'class-validator';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { get } from 'http';
import { Roles } from 'src/decorators/roles.decorator';
import { AddDeviceTokenDto } from 'src/dto/user/add-device-token.dto';
import { AddSocialsDto } from 'src/dto/user/add-socials.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Notification } from 'src/entities/notification.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChatService } from 'src/services/chat.service';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private notificationService: NotificationService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('chats')
  getChat(@Request() req) {
    return this.chatService.getChats(req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('profile/public/:id')
  publicProfile(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('profile')
  async profile(@Request() req) {
    let user = await this.userService.findOne(req.user.email);

    delete user.password;

    let notification = await this.notificationService.getNotificationByUser(
      user.id.toString(),
      req.user.lang,
    );

    let userWithNotification: any = {};

    Object.assign(userWithNotification, user);

    let notificationFormated = [];

    const defaultNotificationFr = {
      id: 0,
      title: 'Bienvenue !',
      content: "Toutes vos notifications s'afficherons ici, restez à l'affut !",
      IsNew: false,
      action: ' ',
    };

    const defaultNotificationEn = {
      id: 0,
      title: 'Welcome !',
      content: 'All of your notification will be displayed here, stay tuned !',
      IsNew: false,
      action: ' ',
    };

    if (req.user.lang === LanguageEnum.FR) {
      notificationFormated.push(defaultNotificationFr);
    } else {
      notificationFormated.push(defaultNotificationEn);
    }

    notification.forEach((notification) => {
      notificationFormated.push({
        id: notification.notification_status[0].id,
        title: notification.title,
        content: notification.content,
        isNew: notification.notification_status[0].isNew,
        action: notification.action,
        url: notification?.url || '',
      });
    });

    userWithNotification.notifications = notificationFormated;

    return userWithNotification;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Get('all')
  getAllUser() {
    return this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Put()
  updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Put(':id')
  updateUserAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Post('deviceToken')
  addDeviceToken(@Request() req, @Body() addDeviceTokenDto: AddDeviceTokenDto) {
    return this.userService.updateDeviceToken(
      req.user.userId,
      addDeviceTokenDto.deviceToken,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Post('socials')
  addSocials(@Request() req, @Body() addDeviceTokenDto: AddSocialsDto) {
    return this.userService.addSocials(req.user.userId, addDeviceTokenDto);
  }
}
