import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { SERVICES, TCP_PATTERN } from 'Libs/Common/Constant';
import { TokenValidationResponseDto } from 'Libs/Common/DTO/auth.dto';

interface ExpressRequest {
  headers: {
    authorization?: string;
    [key: string]: any;
  };
}

interface AuthenticatedRequest extends Request {
  user: {
    uniq_id: number;
    first_name: string;
    last_name?: string;
    role: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(SERVICES.AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const result = await firstValueFrom(
        this.authClient.send<TokenValidationResponseDto>(
          TCP_PATTERN.AUTH_VERFIY_TOKEN,
          { token },
        ),
      );

      if (!result.valid || !result.user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      (request as AuthenticatedRequest).user = result.user;
      return true;
    } catch (error: any) {
      console.log(error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: ExpressRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
