// dtos/sme.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer'; // <-- IMPORTED

export class CreateSMEDto {
  @ApiProperty({ description: 'First name of the SME' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiPropertyOptional({ description: 'Last name of the SME' })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ description: 'Company email' })
  @IsEmail()
  @IsNotEmpty()
  company_email!: string;

  @ApiProperty({ description: 'Password for login' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number!: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  company_name!: string;

  @ApiProperty({ description: 'Company address' })
  @IsString()
  @IsNotEmpty()
  company_address!: string;

  @ApiProperty({ description: 'Monthly sales' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  company_monthly_sales!: number;

  @ApiProperty({ description: 'Annual sales' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  company_annual_sales!: number;

  @ApiPropertyOptional({ description: 'Google ID for OAuth login' })
  @IsString()
  @IsOptional()
  google_id?: string;

  @ApiPropertyOptional({ description: 'Role of the user' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ description: 'Aadhar number', format: 'binary' })
  @IsOptional()
  aadhar!: any;

  @ApiProperty({ description: 'PAN number', format: 'binary' })
  @IsOptional()
  pan!: any;

  @ApiProperty({
    description: 'Company collaterals as an array of strings',
    type: [String],
    example: ['"pan.pdf"', '"aadhar.pdf"'],
  })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  collaterals!: string[];

  @ApiProperty({ description: 'Verification status' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isverified!: boolean;

  @ApiProperty({ description: 'GST number' })
  @IsString()
  @IsNotEmpty()
  company_GST_Number: string;

  @ApiProperty({ description: 'Balance amount' })
  @Type(() => Number)
  @IsNumber()
  balance_amount!: number;

  @ApiProperty({ description: 'Company logo URL' })
  @IsString()
  @IsNotEmpty()
  company_logo!: string;

  @ApiProperty({ description: 'Company description' })
  @IsString()
  @IsNotEmpty()
  company_description!: string;
}

export class SMEResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  expires_in: number;

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
  };
}

export class SMELoginDTO {
  @ApiPropertyOptional({ description: 'Company email' })
  @IsEmail()
  @IsNotEmpty()
  company_email!: string;

  @ApiPropertyOptional({ description: 'Password for login' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ description: 'Google ID for OAuth login' })
  @IsString()
  @IsOptional()
  google_id?: string;
}

