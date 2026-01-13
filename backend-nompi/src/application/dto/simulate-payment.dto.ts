import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SimulatePaymentDto {
  @IsString()
  @IsNotEmpty()
  productSku!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  cardNumber!: string;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail!: string;

  @IsString()
  @IsNotEmpty()
  customerDocument!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsNumber()
  @IsOptional()
  baseFee?: number;

  @IsNumber()
  @IsOptional()
  deliveryFee?: number;
}

export type SimulatePaymentResponseDto = {
  status: 'APPROVED' | 'DECLINED';
  transactionId?: string;
};
