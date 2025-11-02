import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, TCP_PATTERNS } from 'Libs/Common/Constant';
import { LoginDto, RefreshTokenDto, TokenValidationResponseDto } from 'Libs/Common/DTO/auth.dto';
import { CreateInvestorDto, InvestorResponse } from 'Libs/Common/DTO/Investor.dto';
import { CreateSMEDto, SMEResponse } from 'Libs/Common/DTO/SME.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SERVICES.AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async SMEregister(registerDto: CreateSMEDto): Promise<SMEResponse> {
    console.log("seding the request to the auth server");
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.SME_AUTH_REGISTER, registerDto),
    );
  }

  async InvesterRegister(registerDto: CreateInvestorDto): Promise<InvestorResponse>{
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.INVESETER_AUTH_REGISTER, registerDto),
    );
  }

  async Investerlogin(loginDto: LoginDto): Promise<InvestorResponse> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.INVESETER_AUTH_LOGIN, loginDto),
    );
  }

  async SMELogin(LoginDto: LoginDto): Promise<SMEResponse>{
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.SME_AUTH_LOGIN, LoginDto),
    );  
  }

  async SMERefreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<SMEResponse> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.SME_AUTH_REFRESH_TOKEN, refreshTokenDto),
    );
  }

  async InvesterRefreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<InvestorResponse> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.INVESETER_AUTH_REFRESH_TOKEN, refreshTokenDto),
    );
  }

  async SMEverifyToken(token: string): Promise<TokenValidationResponseDto> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.SME_AUTH_VERFIY_TOKEN, { token }),
    );
  }

  async InvesterverifyToken(token: string): Promise<TokenValidationResponseDto> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.INVESETER_AUTH_VERFIY_TOKEN, { token }),
    );
  }

  async SMElogout(userId: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.SME_AUTH_LOGOUT, { userId }),
    );
  }

  async Investerlogout(userId: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.INVESETER_AUTH_LOGOUT, { userId }),
    );
  }
}
