import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule,{
    transport: Transport.TCP,
   options:{
    host:"0.0.0.0",
    port: parseInt(process.env.AUTH_SERVICE_PORT!) || 3001,
   }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_SERVICE_PORT', 3001);
  Logger.log(`Auth Service is running on TCP port ${port}`);
}
bootstrap().catch((error) => {
  console.error('Error starting Auth Service:', error);
  process.exit(1);
});