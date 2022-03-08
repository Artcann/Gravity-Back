import { UserService } from './user.service';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { createTransport } from 'nodemailer'
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/entities/token.entity';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/enums/role.enum';
import { EmailVerificationDto } from 'src/dto/auth/emailVerification.dto';
import { google } from 'googleapis';

@Injectable()
export class AuthService {

  private transporter;

  constructor(private jwtService: JwtService, private userService: UserService) {
    this.generateTransporter();
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async mailLogin(emailVerificationDto: EmailVerificationDto) {
    const user = await this.userService.findOne(emailVerificationDto.email);

    if(!(user.role.includes(Role.VerifiedUser))) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Your account is not verified"
      })
    } else {
      const payload = { email: emailVerificationDto.email };
      return {
        access_token: this.jwtService.sign(payload),
      }
    }
    
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "User not found"
      })
    } else if (!(user.role?.includes(Role.VerifiedUser))){
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


    try {
      await this.transporter.verify();
      await this.transporter.sendMail({
        from: "service@gravity.com",
        to: user.email,
        subject: "Verification Mail",
        text: "http://localhost:3000/auth/confirmation/" + token.token,
      })
    } catch (err) {
      console.error(err);
    }
  }

  async generateTransporter() {
    const MAIL = "arthur.cann.29@gmail.com"

    const oauth2Client = new google.auth.OAuth2(
      process.env.MAILER_CLIENT_ID,
      process.env.MAILER_PRIVATE_KEY,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });

    const access_token = await oauth2Client.getAccessToken();

    this.transporter = await createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: MAIL,
        clientId: process.env.MAILER_CLIENT_ID,
        clientSecret: process.env.MAILER_PRIVATE_KEY,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: access_token
      },
    });
  }
}
