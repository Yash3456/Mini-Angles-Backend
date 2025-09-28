import { Injectable } from '@nestjs/common';

@Injectable()
export class LoanManagementService {
  getHello(): string {
    return 'Hello World!';
  }
}
