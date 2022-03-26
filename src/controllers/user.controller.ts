import { ClassSerializerInterceptor, Controller, Get, Param, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { get } from 'http';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('profile/public/:id')
  publicProfile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('profile')
  profile(@Request() req) {
    return this.userService.findOne(req.user.email);
  }

}
