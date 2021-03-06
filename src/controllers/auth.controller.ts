import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { Controller, Get, Post, Body, Request, UseGuards, HttpStatus, NotFoundException} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { Token } from 'src/entities/token.entity';
import { User } from 'src/entities/user.entity';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Role } from 'src/entities/role.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService) { }
  
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {

      const user = await this.userService.create(createUserDto);
      const token = Token.create({userId: user.id, token: randomBytes(16).toString('hex')});
      Token.save(token);
  
      this.authService.sendVerificationMail(user, token);
  
      return user;

      
    }
  
    @Get('confirmation/:token')
    async confirmProfile(@Request() req) {
      const token = await Token.findOne({ token: req.params.token });
      const userId = token.userId;
      let user = await User.findOne(userId);
      if(!user) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: "User not found"
        })
      }
      const verifiedRole = await Role.findOne({roleLabel: RoleEnum.VerifiedUser});
      if(user.role.includes(verifiedRole)) {
        return "Your account is already activated"
      } else {
        user.role.push(verifiedRole);
        user.save();
    
        return "Your account has been activated";
      }
      
  
    }
  
    @Post('confirmation/resend/:mail')
    async resendMail(@Request() req) {
      const mail = req.params.mail;
      const user = await User.findOne({ email: mail});
      Token.delete({ userId: user.id });
  
      const token = Token.create({userId: user.id, token: randomBytes(16).toString('hex')});
      Token.save(token);
      
      this.authService.sendVerificationMail(user, token);
  
      return "mail sent successfully";
    }
  
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
      const reponse = this.authService.login(req.user);

      const userEntity = await User.findOne(req.user.id);
      userEntity.firstConnection = false;
  
      userEntity.save();

      return reponse;
    }
  
}
