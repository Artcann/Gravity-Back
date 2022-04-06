import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { get } from 'http';
import { Roles } from 'src/decorators/roles.decorator';
import { AddDeviceTokenDto } from 'src/dto/user/add-device-token.dto';
import { AddSocialsDto } from 'src/dto/user/add-socials.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChatService } from 'src/services/chat.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService, private chatService: ChatService) {}

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
  profile(@Request() req) {
    return this.userService.findOne(req.user.email);
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
  updateUserAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Post('deviceToken')
  addDeviceToken(@Request() req, @Body() addDeviceTokenDto: AddDeviceTokenDto) {
    return this.userService.updateDeviceToken(req.user.userId, addDeviceTokenDto.deviceToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Post('socials')
  addSocials(@Request() req, @Body() addDeviceTokenDto: AddSocialsDto) {
    return this.userService.addSocials(req.user.userId, addDeviceTokenDto);
  }

}
