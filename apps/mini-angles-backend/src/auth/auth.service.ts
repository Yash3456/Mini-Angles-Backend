import { SERVICES, TCP_PATTERNS } from '@app/common/constant';
import {
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  TokenValidationResponseDto,
} from '@app/common/dto/auth.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SERVICES.AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.AUTH_REGISTER, registerDto),
    );
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.AUTH_LOGIN, loginDto),
    );
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.AUTH_REFRESH_TOKEN, refreshTokenDto),
    );
  }

  async verifyToken(token: string): Promise<TokenValidationResponseDto> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.AUTH_VERIFY_TOKEN, { token }),
    );
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this.authClient.send(TCP_PATTERNS.AUTH_LOGOUT, { userId }),
    );
  }
}
