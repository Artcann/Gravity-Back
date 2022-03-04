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

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';

import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true}),
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  }),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.LOCAL_ADDR,
    port: parseInt(process.env.DB_PORT),
    username: process.env.LOCAL_USER,
    password: process.env.LOCAL_PASS,
    database: process.env.DB_NAME,
    entities: [User, Token, Event],
    synchronize: true,
  })],
  controllers: [AuthController, UserController, EventController],
  providers: [AuthService, UserService, EventService, JwtStrategy, LocalStrategy],
})
export class AppModule {}
