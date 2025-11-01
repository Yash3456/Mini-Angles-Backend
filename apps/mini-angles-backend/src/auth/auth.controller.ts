import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@app/common/dto/auth.dto';
import { BaseResponseDto } from '@app/common/dto/base.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);
    return new BaseResponseDto(result, 'User registered successfully');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return new BaseResponseDto(result, 'Login successful');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return new BaseResponseDto(result, 'Token refreshed successfully');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getProfile(
    @Request() req: AuthenticatedRequest,
  ): BaseResponseDto<AuthenticatedRequest['user']> {
    return new BaseResponseDto(req.user, 'Profile retrieved successfully');
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(
    @Request() req: AuthenticatedRequest,
  ): Promise<BaseResponseDto<{ success: boolean }>> {
    const result = await this.authService.logout(req.user.id);
    return new BaseResponseDto(result, 'Logout successful');
  }
}
