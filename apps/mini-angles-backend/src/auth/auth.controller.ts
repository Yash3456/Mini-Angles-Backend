import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
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
import { BaseResponseDto } from 'Libs/Common/DTO/base.dto';
import { CreateSMEDto, SMEResponse } from 'Libs/Common/DTO/SME.dto';
import { LoginDto, RefreshTokenDto } from 'Libs/Common/DTO/auth.dto';
import {
  CreateInvestorDto,
  InvestorResponse,
} from 'Libs/Common/DTO/Investor.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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

  @Get('SMERegister')
  async Hello(): Promise<string> {
    return 'Hello SME Register';
  }

  @Post('SMERegister')
  @ApiOperation({ summary: 'Register a new SME user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: SMEResponse,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'aadhar',
        maxCount: 1,
      },
      { name: 'pan', maxCount: 1 },
    ]),
  )
  async SMEregister(
    @Body() registerDto: CreateSMEDto,
    @UploadedFiles()
    files: { aadhar?: Express.Multer.File[]; pan?: Express.Multer.File[] },
  ): Promise<BaseResponseDto<SMEResponse>> {
    if (!files.aadhar || !files.aadhar[0]) {
      throw new BadRequestException('Aadhar file is required.');
    }
    if (!files.pan || !files.pan[0]) {
      throw new BadRequestException('PAN file is required.');
    }

    let updatedRegisterDto = {
      ...registerDto,
      adahar: files.aadhar,
      pan: files.pan,
    };
    console.log('Request sent to the respective Service');
    const result = await this.authService.SMEregister(updatedRegisterDto);
    return new BaseResponseDto(result, 'User registered successfully');
  }

  @Post('InvesterRegister')
  @ApiOperation({ summary: 'Register a new Invester user' })
  @ApiResponse({
    status: 201,
    description: 'Invester User registered successfully',
    type: InvestorResponse,
  })
  async InvesterRegister(
    @Body() registerDto: CreateInvestorDto,
  ): Promise<BaseResponseDto<InvestorResponse>> {
    const result = await this.authService.InvesterRegister(registerDto);
    return new BaseResponseDto(result, 'Invester User registered successfully');
  }

  @Post('SMElogin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login SME user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful for SME User',
    type: SMEResponse,
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<BaseResponseDto<SMEResponse>> {
    const result = await this.authService.SMELogin(loginDto);
    return new BaseResponseDto(result, 'Login successful');
  }

  @Post('InvesterLogin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login Invester user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful for Invester User',
    type: InvestorResponse,
  })
  async Investerlogin(
    @Body() loginDto: LoginDto,
  ): Promise<BaseResponseDto<InvestorResponse>> {
    const result = await this.authService.Investerlogin(loginDto);
    return new BaseResponseDto(result, 'Login successful');
  }

  @Post('SMERefresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token for SME' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: SMEResponse,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<BaseResponseDto<SMEResponse>> {
    const result = await this.authService.SMERefreshToken(refreshTokenDto);
    return new BaseResponseDto(result, 'Token refreshed successfully');
  }

  @Post('InvesterRefresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token for Invester' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully for Invester',
    type: InvestorResponse,
  })
  async InvesterRefreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<BaseResponseDto<InvestorResponse>> {
    const result = await this.authService.InvesterRefreshToken(refreshTokenDto);
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

  @Post('SMElogout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout SME user' })
  async logout(
    @Request() req: AuthenticatedRequest,
  ): Promise<BaseResponseDto<{ success: boolean }>> {
    const result = await this.authService.SMElogout(req.user.id);
    return new BaseResponseDto(result, 'Logout successful');
  }

  @Post('Investerlogout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout Invester user' })
  async Investerlogout(
    @Request() req: AuthenticatedRequest,
  ): Promise<BaseResponseDto<{ success: boolean }>> {
    const result = await this.authService.Investerlogout(req.user.id);
    return new BaseResponseDto(result, 'Invester Logout successful');
  }
}
