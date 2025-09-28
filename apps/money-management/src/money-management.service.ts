import { Injectable } from '@nestjs/common';

@Injectable()
export class MoneyManagementService {
  getHello(): string {
    return 'Hello World!';
  }
}
