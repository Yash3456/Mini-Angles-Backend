import { Controller, Get, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TCP_PATTERNS } from 'Libs/Common/Constant';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSMEDto } from 'Libs/Common/DTO/SME.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly AuthService: AuthService) {}

  @MessagePattern(TCP_PATTERNS.SME_AUTH_REGISTER)
  SMEregister(@Payload() registerDto: CreateSMEDto) {
    this.logger.debug(`Register request: ${registerDto.company_email}`);
    return this.AuthService.createSME(registerDto);
  }
}
