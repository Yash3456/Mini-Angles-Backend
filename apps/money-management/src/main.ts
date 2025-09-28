import { NestFactory } from '@nestjs/core';
import { MoneyManagementModule } from './money-management.module';

async function bootstrap() {
  const app = await NestFactory.create(MoneyManagementModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
