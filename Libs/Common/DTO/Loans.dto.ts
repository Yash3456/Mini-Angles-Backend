// dtos/loan.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ description: "Loan amount" })
  @IsNumber()
  @IsNotEmpty()
  loan_amount!: number;

  @ApiProperty({ description: "Loan interest rate" })
  @IsNumber()
  @IsNotEmpty()
  loan_interest!: number;

  @ApiProperty({ description: "Receiver SME ID" })
  @IsInt()
  @IsNotEmpty()
  reciever_id!: number;

  @ApiProperty({ description: "EMandate amount" })
  @IsInt()
  @IsNotEmpty()
  emandate_amount!: number;

  @ApiPropertyOptional({ description: "Estimated repayment date (ISO string)" })
  @IsDateString()
  @IsOptional()
  estimate_date_of_repay?: string;

  @ApiProperty({ description: "Platform through which loan was made" })
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @ApiPropertyOptional({ description: "Transaction ID associated with the loan" })
  @IsInt()
  @IsOptional()
  transaction_id?: number;
}

export class UpdateLoanDto {
  @ApiPropertyOptional({ description: "Loan amount" })
  @IsNumber()
  @IsOptional()
  loan_amount?: number;

  @ApiPropertyOptional({ description: "Loan interest rate" })
  @IsNumber()
  @IsOptional()
  loan_interest?: number;

  @ApiPropertyOptional({ description: "EMandate amount" })
  @IsInt()
  @IsOptional()
  emandate_amount?: number;

  @ApiPropertyOptional({ description: "Estimated repayment date (ISO string)" })
  @IsDateString()
  @IsOptional()
  estimate_date_of_repay?: string;

  @ApiPropertyOptional({ description: "Platform" })
  @IsString()
  @IsOptional()
  platform?: string;
}

export class LoanResponseDto {
  @ApiProperty({ description: "Loan ID" })
  uniq_id!: number;

  @ApiProperty({ description: "Loan amount" })
  loan_amount!: number;

  @ApiProperty({ description: "Loan interest rate" })
  loan_interest!: number;

  @ApiProperty({ description: "Receiver SME ID" })
  reciever_id!: number;

  @ApiProperty({ description: "EMandate amount" })
  emandate_amount!: number;

  @ApiPropertyOptional({ description: "Estimated repayment date" })
  estimate_date_of_repay?: string;

  @ApiProperty({ description: "Platform used" })
  platform!: string;

  @ApiPropertyOptional({ description: "Transaction ID associated" })
  transaction_id?: number;

  @ApiProperty({ description: "Created timestamp" })
  created_at!: Date;

  @ApiProperty({ description: "Updated timestamp" })
  updated_at!: Date;
}
