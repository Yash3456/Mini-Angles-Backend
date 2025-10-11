// dtos/investment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({ description: "ID of the investor making the investment" })
  @IsInt()
  @IsNotEmpty()
  investorId!: number;

  @ApiProperty({ description: "ID of the SME being invested in" })
  @IsInt()
  @IsNotEmpty()
  smeId!: number;

  @ApiProperty({ description: "Amount invested" })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}

export class UpdateInvestmentDto {
  @ApiPropertyOptional({ description: "Amount invested" })
  @IsNumber()
  amount?: number;
}

export class InvestmentResponseDto {
  @ApiProperty({ description: "Investment ID" })
  id!: number;

  @ApiProperty({ description: "Investor ID" })
  investorId!: number;

  @ApiProperty({ description: "SME ID" })
  smeId!: number;

  @ApiProperty({ description: "Amount invested" })
  amount!: number;

  @ApiProperty({ description: "Created timestamp" })
  createdAt!: Date;

  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt!: Date;
}
