import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'Libs/Database/src/database.module';
import { RedisModule } from 'Libs/Redis/src';
import { PassportModule } from '@nestjs/passport';
import { OcrTesseractService } from 'Libs/Hooks';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    DatabaseModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OcrTesseractService],
})
export class AuthModule {}
