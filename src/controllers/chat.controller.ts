import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ChatService } from 'src/services/chat.service';
import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/enums/role.enum';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) { }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Get('connected_users')
  getConnectedUsers() {
    return this.chatService.getConnectedUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Get('all/:id')
  getAllChatOfSpecificUser(@Param('id') id: string) {
    return this.chatService.getChats(id);
  }
}