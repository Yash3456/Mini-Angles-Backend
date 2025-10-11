// dtos/investor.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean, IsNotEmpty } from 'class-validator';

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
  monthly_income!: string;

  @ApiProperty({ description: "Annual family income" })
  @IsString()
  @IsNotEmpty()
  annual_family_income!: string;

  @ApiProperty({ description: "Profile image URL" })
  @IsString()
  @IsNotEmpty()
  image_url!: string;

  @ApiProperty({ description: "Aadhar card number" })
  @IsString()
  @IsNotEmpty()
  aadhar_card!: string;

  @ApiProperty({ description: "PAN card number" })
  @IsString()
  @IsNotEmpty()
  pan_card!: string;

  @ApiProperty({ description: "Total amount invested" })
  @IsString()
  @IsNotEmpty()
  amount_invested!: string;

  @ApiPropertyOptional({ description: "Google ID for OAuth login" })
  @IsString()
  @IsOptional()
  google_id?: string;

  @ApiProperty({ description: "Verification status" })
  @IsBoolean()
  isverified!: boolean;
}
