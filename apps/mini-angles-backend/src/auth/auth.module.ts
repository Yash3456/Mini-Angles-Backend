import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SERVICES } from 'Libs/Common/Constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT || '3001'),
        },
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
