// dtos/company-growth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCompanyGrowthDto {
  @ApiProperty({ description: "ID of the SME" })
  @IsInt()
  @IsNotEmpty()
  smeId!: number;

  @ApiProperty({ description: "Month of growth record (1-12)" })
  @IsInt()
  @IsNotEmpty()
  month!: number;

  @ApiProperty({ description: "Year of growth record" })
  @IsInt()
  @IsNotEmpty()
  year!: number;

  @ApiProperty({ description: "Revenue of the company" })
  @IsNumber()
  @IsNotEmpty()
  revenue!: number;

  @ApiPropertyOptional({ description: "Profit of the company" })
  @IsNumber()
  @IsOptional()
  profit?: number;

  @ApiPropertyOptional({ description: "Valuation of the company" })
  @IsNumber()
  @IsOptional()
  valuation?: number;
}

export class UpdateCompanyGrowthDto {
  @ApiPropertyOptional({ description: "Revenue of the company" })
  @IsNumber()
  @IsOptional()
  revenue?: number;

  @ApiPropertyOptional({ description: "Profit of the company" })
  @IsNumber()
  @IsOptional()
  profit?: number;

  @ApiPropertyOptional({ description: "Valuation of the company" })
  @IsNumber()
  @IsOptional()
  valuation?: number;
}

export class CompanyGrowthResponseDto {
  @ApiProperty({ description: "Growth record ID" })
  id!: number;

  @ApiProperty({ description: "SME ID" })
  smeId!: number;

  @ApiProperty({ description: "Month" })
  month!: number;

  @ApiProperty({ description: "Year" })
  year!: number;

  @ApiProperty({ description: "Revenue" })
  revenue!: number;

  @ApiProperty({ description: "Profit" })
  profit?: number;

  @ApiProperty({ description: "Valuation" })
  valuation?: number;

  @ApiProperty({ description: "Record created timestamp" })
  createdAt!: Date;
}
