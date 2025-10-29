// dtos/investor.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvestorDto {
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

  @ApiProperty({ description: "Monthly income" })
  @IsString()
  @IsNotEmpty()
  monthly_income!: number;

  @ApiProperty({ description: "Annual family income" })
  @IsString()
  @IsNotEmpty()
  annual_family_income!: number;

  @ApiProperty({ description: "Profile image URL" })
  @IsString()
  @IsNotEmpty()
  image_url!: string;

  @ApiProperty({ description: "Aadhar card number",format: 'binary' })
  @IsString()
  @IsNotEmpty()
  aadhar_card!: any;

  @ApiProperty({ description: "PAN card number", format: 'binary'})
  @IsString()
  @IsNotEmpty()
  pan_card!: any;

  @ApiProperty({ description: "Total amount invested" })
  @IsNumber()
  @IsNotEmpty()
  amount_invested!: number;

  @ApiPropertyOptional({ description: "Google ID for OAuth login" })
  @IsString()
  @IsOptional()
  google_id?: string;

  @ApiProperty({ description: "Verification status" })
  @IsBoolean()
  isverified!: boolean;
}

export class InvestorResponse {
  @ApiProperty()
  access_token : string;

  @ApiProperty()
  refresh_token : string;

  @ApiProperty()
  expires_in : number;

  @ApiProperty()
  Investor: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    amount_invested: number;
    monthly_income: number;
    annual_family_income: number;
    image_url: string;
    isverified: boolean;
  }
}

export class InvestorLoginDTO {
  @ApiPropertyOptional({ description: "Personal email" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  
  @ApiPropertyOptional({ description: "Password for login" })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ description: "Google ID for OAuth login" })
  @IsString()
  @IsOptional()
  google_id?: string;
}

export class InvestorTokenValidationDTO {
  @ApiProperty({ description: "True or False" })
  valid: boolean;

  @ApiProperty({ required: false})
  Investor?:{
    uniq_id: number;
    first_name: string;
    last_name: string;
  }
}
