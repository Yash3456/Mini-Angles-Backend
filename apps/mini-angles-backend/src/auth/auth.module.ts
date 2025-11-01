import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SERVICES } from '@app/common/constant';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
      },
      {
        name: SERVICES.USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT || '3002'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
