import { Test, TestingModule } from '@nestjs/testing';
import { MoneyManagementController } from './money-management.controller';
import { MoneyManagementService } from './money-management.service';

describe('MoneyManagementController', () => {
  let moneyManagementController: MoneyManagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MoneyManagementController],
      providers: [MoneyManagementService],
    }).compile();

    moneyManagementController = app.get<MoneyManagementController>(MoneyManagementController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(moneyManagementController.getHello()).toBe('Hello World!');
    });
  });
});
