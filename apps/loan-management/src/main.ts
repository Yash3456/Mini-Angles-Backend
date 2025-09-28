import { NestFactory } from '@nestjs/core';
import { LoanManagementModule } from './loan-management.module';

async function bootstrap() {
  const app = await NestFactory.create(LoanManagementModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
