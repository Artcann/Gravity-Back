import { LocalStrategy } from './guards/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { Roles } from './decorators/roles.decorator';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

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
    entities: [User, Token],
    synchronize: true,
  })],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtStrategy, LocalStrategy],
})
export class AppModule {}
