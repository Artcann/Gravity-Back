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

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { StaticService } from './services/static.service';

import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { EventTranslation } from './entities/event-translation.entity';
import { SponsorTranslation } from './entities/sponsor-translation.entity';
import { QuaranteMilleEuros } from './entities/sponsor.entity';
import { Member } from './entities/member.entity';
import { MemberTranslation } from './entities/member-translation.enum';
import { Presentation } from './entities/presentation.entity';



@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true}),
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [User, Token, Event, EventTranslation, Member, MemberTranslation,
    QuaranteMilleEuros, SponsorTranslation, Presentation],
    synchronize: true,
    autoLoadEntities: true,
  })],
  controllers: [AuthController, UserController, EventController, StaticController],
  providers: [AuthService, UserService, EventService, StaticService, JwtStrategy, LocalStrategy],
})
export class AppModule {}
