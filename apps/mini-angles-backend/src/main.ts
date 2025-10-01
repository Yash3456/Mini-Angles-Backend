import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger();

  app.use(helmet());

  app.use(compression());

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') || [] : true, 
    Credential:true
  })

  app.useGlobalPipes( new ValidationPipe({whitelist:true, forbidNonWhitelisted:true,transform:true}));

app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters();
  app.setGlobalPrefix('api/');
  
if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Microservices API')
      .setDescription('API Gateway for microservices architecture')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port: number = configService.get<number>('API_GATEWAY_PORT') ?? 3000;
  await app.listen(port, '0.0.0.0');

   logger.log(`🚀 API Gateway is running on: http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`📚 API Documentation: http://localhost:${port}/docs`);
  }
}


bootstrap().catch((error)=> {
  console.error('Failed to start Mini-Anles-Api-Gateway:',error);
  process.exit(1);
});
