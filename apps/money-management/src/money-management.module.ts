import { Module } from '@nestjs/common';
import { MoneyManagementController } from './money-management.controller';
import { MoneyManagementService } from './money-management.service';

@Module({
  imports: [],
  controllers: [MoneyManagementController],
  providers: [MoneyManagementService],
})
export class MoneyManagementModule {}
