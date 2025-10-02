import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule} from "@nestjs/throttler";
import { SERVICES } from 'Libs/Common/Constant';
import {ClientsModule, Transport} from "@nestjs/microservices";
import { RedisModule } from 'Libs/Redis/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit:100
      }
    ]),

    ClientsModule.register([
      {
        name:SERVICES.AUTH_SERVICE,
        transport: Transport.TCP,
        options:{
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT || '3001'),
        }
      },
      {
        name:SERVICES.USER_SERVICE,
        transport: Transport.TCP,
        options:{
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT || '3002'),
        }
      },
      {
        name:SERVICES.LOAN_SERVICE,
        transport: Transport.TCP,
        options:{
          host: process.env.LOAN_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.LOAN_SERVICE_PORT || '3004'),
        }
      },
      {
        name:SERVICES.MONEY_SERVICE,
        transport: Transport.TCP,
        options:{
          host: process.env.MONEY_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.MONEY_SERVICE_PORT || '3003'),
        }
      },
    ]),
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
