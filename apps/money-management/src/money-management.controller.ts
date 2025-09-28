import { Controller, Get } from '@nestjs/common';
import { MoneyManagementService } from './money-management.service';

@Controller()
export class MoneyManagementController {
  constructor(private readonly moneyManagementService: MoneyManagementService) {}

  @Get()
  getHello(): string {
    return this.moneyManagementService.getHello();
  }
}
