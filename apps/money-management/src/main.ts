import { NestFactory } from '@nestjs/core';
import { MoneyManagementModule } from './money-management.module';

async function bootstrap() {
  const app = await NestFactory.create(MoneyManagementModule);
  await app.listen(process.env.MONEY_SERVICE_PORT ?? 3003);
  console.log(`Money Management Service is running on port ${process.env.MONEY_SERVICE_PORT ?? 3003}`);
}
bootstrap();
