import { UserService } from './user.service';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { createTransport } from 'nodemailer'
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/entities/token.entity';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/enums/role.enum';
import * as mailerKeys from './mailer-key.json';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService, private userService: UserService) {}

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "User not found"
      })
    } else if (!(user.role?.includes(Role.User))){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Your account is not verified"
      })
    } else if (user && await user.validatePassword(pass) && (user.role?.includes(Role.User))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendVerificationMail(user: User, token: Token) {
    const MAIL = "ws-maker@garageisep.com"

    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: MAIL,
        serviceClient: mailerKeys.client_id,
        privateKey: mailerKeys.private_key
      },
    });

    try {
      await transporter.verify();
      await transporter.sendMail({
        from: MAIL,
        to: user.email,
        subject: "Verification Mail",
        text: "http://localhost:3000/auth/confirmation/" + token.token,
      })
    } catch (err) {
      console.error(err);
    }
  }
}
