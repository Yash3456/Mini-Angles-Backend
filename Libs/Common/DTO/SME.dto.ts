// dtos/sme.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean, IsNumber, IsNotEmpty, IsJSON } from 'class-validator';

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
  company_monthly_sales!: string;

  @ApiProperty({ description: "Annual sales" })
  @IsString()
  @IsNotEmpty()
  company_annual_sales!: string;

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

  @ApiProperty({ description: "Company collaterals in JSON format" })
  @IsJSON()
  @IsNotEmpty()
  collaterals!: any;

  @ApiProperty({ description: "Verification status" })
  @IsBoolean()
  isverified!: boolean;

  @ApiProperty({ description: "GST number" })
  @IsString()
  @IsNotEmpty()
  Company_GST_Number!: string;

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
