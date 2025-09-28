import { Test, TestingModule } from '@nestjs/testing';
import { LoanManagementController } from './loan-management.controller';
import { LoanManagementService } from './loan-management.service';

describe('LoanManagementController', () => {
  let loanManagementController: LoanManagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoanManagementController],
      providers: [LoanManagementService],
    }).compile();

    loanManagementController = app.get<LoanManagementController>(LoanManagementController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(loanManagementController.getHello()).toBe('Hello World!');
    });
  });
});
