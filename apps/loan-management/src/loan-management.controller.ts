import { Controller, Get } from '@nestjs/common';
import { LoanManagementService } from './loan-management.service';

@Controller()
export class LoanManagementController {
  constructor(private readonly loanManagementService: LoanManagementService) {}

  @Get()
  getHello(): string {
    return this.loanManagementService.getHello();
  }
}
