// dtos/sme.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsString, IsOptional, IsEmail, IsBoolean, IsNumber, IsNotEmpty, IsJSON, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateSMEDto {
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

  @ApiProperty({ description: "Company address" })
  @IsString()
  @IsNotEmpty()
  company_address!: string;

  @ApiProperty({ description: "Monthly sales" })
  @IsString()
  @IsNotEmpty()
  company_monthly_sales!: number;

  @ApiProperty({ description: "Annual sales" })
  @IsString()
  @IsNotEmpty()
  company_annual_sales!: number;

  @ApiPropertyOptional({ description: "Google ID for OAuth login" })
  @IsString()
  @IsOptional()
  google_id?: string;

  @ApiPropertyOptional({ description: "Role of the user" })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ description: "Aadhar number" })
  @IsString()
  @IsNotEmpty()
  aadhar!: string;

  @ApiProperty({ description: "PAN number" })
  @IsString()
  @IsNotEmpty()
  pan!: string;

  @ApiProperty({
    description: 'Company collaterals as an array of strings',
    type: [String],
    example: ['pan.pdf', 'aadhar.pdf'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) 
  collaterals!: string[];

  @ApiProperty({ description: "Verification status" })
  @IsBoolean()
  isverified!: boolean;

  @ApiProperty({ description: "GST number" })
  @IsString()
  @IsNotEmpty()
  Company_GST_Number: string;

  @ApiProperty({ description: "Balance amount" })
  @IsNumber()
  Balance_Amount!: number;

  @ApiProperty({ description: "Company logo URL" })
  @IsString()
  @IsNotEmpty()
  company_logo!: string;

  @ApiProperty({ description: "Company description" })
  @IsString()
  @IsNotEmpty()
  company_description!: string;
}

export class SMEResponse {
  @ApiProperty()
  access_token : string;

  @ApiProperty()
  refresh_token : string;

  @ApiProperty()
  expires_in : number;

  @ApiProperty()
  SME: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    company_name: string;
    company_address: string;
    company_monthly_sales: number;
    company_annual_sales: number;
    role: string;
    balance_amount: number;
    isverified: boolean;
    company_logo: string;
    company_description: string;
    company_GST_Number: string;
    collaterals: string[];
  }
}
