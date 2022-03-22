import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('profile')
  profile(@Request() req) {
    return this.userService.findOneWithoutPass(req.user.email);
  }
}
