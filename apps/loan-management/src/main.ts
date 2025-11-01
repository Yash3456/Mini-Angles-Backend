import { NestFactory } from '@nestjs/core';
import { LoanManagementModule } from './loan-management.module';

async function bootstrap() {
  const app = await NestFactory.create(LoanManagementModule);
  await app.listen(process.env.LOAN_SERVICE_PORT ?? 3004);
  console.log(`Loan Management Service is running on port ${process.env.LOAN_SERVICE_PORT ?? 3004}`);
}
bootstrap();
