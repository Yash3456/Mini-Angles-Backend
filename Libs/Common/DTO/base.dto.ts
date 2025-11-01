export class BaseResponseDto<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;

  constructor(data: T, message: string = 'Success') {
    this.success = true;
    this.data = data;
    this.message = message;
    this.timestamp = new Date();
  }
}