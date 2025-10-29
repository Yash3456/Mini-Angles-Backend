// dtos/auth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsJSON } from 'class-validator';

// ----------------- LOGIN -----------------
export class LoginDto {
  @ApiProperty({ description: "Email or phone number of the user" })
  @IsString()
  @IsNotEmpty()
  username!: string; // can be email or phone number

  @ApiProperty({ description: "User password" })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

// ----------------- SIGNUP -----------------
// For SME
export class SignupSMEDto {
  @ApiProperty({ description: "First name of the SME" })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiPropertyOptional({ description: "Last name of the SME" })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ description: "Company email" })
  @IsEmail()
  @IsNotEmpty()
  company_email!: string;

  @ApiProperty({ description: "Password for login" })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ description: "Phone number" })
  @IsString()
  @IsNotEmpty()
  phone_number!: string;

  @ApiProperty({ description: "Company name" })
  @IsString()
  @IsNotEmpty()
  company_name!: string;

  @ApiProperty({ description: "Aadhar number" })
  @IsString()
  @IsNotEmpty()
  aadhar!: string;

  @ApiProperty({ description: "PAN number" })
  @IsString()
  @IsNotEmpty()
  pan!: string;

  @ApiProperty({ description: "Collaterals provided by the company in JSON format" })
  @IsJSON()
  @IsNotEmpty()
  collaterals!: any;
}

// For Investor
export class SignupInvestorDto {
  @ApiProperty({ description: "First name of the investor" })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiPropertyOptional({ description: "Last name of the investor" })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ description: "Investor email" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "Password for login" })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ description: "Phone number" })
  @IsString()
  @IsNotEmpty()
  phone_number!: string;

  @ApiProperty({ description: "Aadhar card number" })
  @IsString()
  @IsNotEmpty()
  aadhar_card!: string;

  @ApiProperty({ description: "PAN card number" })
  @IsString()
  @IsNotEmpty()
  pan_card!: string;
}

// ----------------- TOKEN RESPONSE -----------------
export class TokenResponseDto {
  @ApiProperty({ description: "Access token" })
  @IsString()
  access_token!: string;

  @ApiPropertyOptional({ description: "Refresh token" })
  @IsString()
  @IsOptional()
  refresh_token?: string;

  @ApiProperty({ description: "Token expiry in seconds" })
  @IsNumber()
  expires_in!: number;

  @ApiProperty({ description: "Token type" })
  @IsString()
  token_type!: string; // typically 'Bearer'
}

// ----------------- PASSWORD RESET -----------------
export class ResetPasswordDto {
  @ApiProperty({ description: "Email or phone number of the user" })
  @IsString()
  @IsNotEmpty()
  username!: string; // email or phone

  @ApiProperty({ description: "New password" })
  @IsString()
  @IsNotEmpty()
  new_password!: string;
}

// ----------------- UPDATE PASSWORD -----------------
export class UpdatePasswordDto {
  @ApiProperty({ description: "Current password" })
  @IsString()
  @IsNotEmpty()
  current_password!: string;

  @ApiProperty({ description: "New password" })
  @IsString()
  @IsNotEmpty()
  new_password!: string;
}

export class TokenValidationResponseDto {
  @ApiProperty()
  valid: boolean;

  @ApiProperty({required: true})
  user?: {
    id:string;
    email:string;
    first_name:string;
    last_name:string;
    role:string;
  }
}
