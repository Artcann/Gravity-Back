import { UserService } from './user.service';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { createTransport } from 'nodemailer'
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/entities/token.entity';
import { User } from 'src/entities/user.entity';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { EmailVerificationDto } from 'src/dto/auth/emailVerification.dto';
import { google } from 'googleapis';
import { Role } from 'src/entities/role.entity';
import { LanguageEnum } from 'src/entities/enums/language.enum';
import * as path from 'path';
import { readFileSync } from 'fs';
let ejs = require('ejs');
let juice = require('juice');
import { htmlToText} from "html-to-text";
import { juiceResources } from 'juice';

@Injectable()
export class AuthService {

  private transporter;

  constructor(private jwtService: JwtService, private userService: UserService) {
    this.generateTransporter();
  }

  async login(user: User) {
    const userEntity = await User.findOne(user.id);

    const payload = { email: user.email.toLocaleLowerCase(), sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      first_connection: userEntity.firstConnection
    };
  }

  async mailLogin(emailVerificationDto: EmailVerificationDto) {
    const user = await this.userService.findOne(emailVerificationDto.email.toLocaleLowerCase());
    const verifiedRole = await Role.findOne({roleLabel : RoleEnum.VerifiedUser});

    if(!(user.role.includes(verifiedRole))) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Your account is not verified"
      })
    } else {
      const payload = { email: emailVerificationDto.email.toLocaleLowerCase() };
      return {
        access_token: this.jwtService.sign(payload),
      }
    }
    
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email.toLocaleLowerCase());

    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "User not found"
      })
    } else if (!(user.role.some(e => e.roleLabel === RoleEnum.VerifiedUser))){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Your account is not verified"
      })
    } else if (user && await user.validatePassword(pass) && (user.role.some(e => e.roleLabel === RoleEnum.VerifiedUser))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendVerificationMail(user: User, token: Token) {

    const htmlPath = user.language === LanguageEnum.FR
    ? './ressources/templates/mail-fr.html'
    : './ressources/templates/mail-en.html';

    const source = readFileSync(htmlPath, 'utf-8').toString();

    const templateVars = {
      name: user.first_name !== undefined ? user.first_name : "",
      comfirmLink: process.env.API_URL + "auth/confirmation/" + token.token
    }

    const template = ejs.render(source, templateVars);
    const text = htmlToText(template);

    const htmlWithStyle = juice(template);

    try {
      await this.transporter.verify();

      await this.transporter.sendMail({
        from:{
          name: "Liste GRAVITY",
          address: "respo@tech.liste-gravity.fr"},
        to: user.email,
        subject: "Verification Mail",
        text: text,
        html: htmlWithStyle
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
