import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './guards/local.strategy';

import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { EventController } from './controllers/event.controller';
import { StaticController } from './controllers/static.controller';
import { MemberController } from './controllers/member.controller';
import { PresentationController } from './controllers/presentation.controller';
import { SponsorController } from './controllers/sponsor.controller';

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { StaticService } from './services/static.service';
import { MemberService } from './services/member.service';
import { PresentationService } from './services/presentation.service';
import { SponsorService } from './services/sponsor.service';

import * as typeOrmConfig from './typeorm.config';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true}),
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
  }),
  TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [AuthController, UserController, EventController, MemberController, 
    StaticController, PresentationController, SponsorController],
  providers: [AuthService, UserService, EventService, StaticService, MemberService,
    JwtStrategy, LocalStrategy, PresentationService, SponsorService],
})
export class AppModule {}
