import { IsString, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { TransactionStatus } from '../../domain/enums/transactionStatusEnum';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  idProduct!: string;

  @IsString()
  @IsNotEmpty()
  idCustomer!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsNumber()
  @IsNotEmpty()
  baseFee!: number;

  @IsNumber()
  @IsNotEmpty()
  deliveryFee!: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status!: TransactionStatus;
}

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  idProduct!: string;

  @IsString()
  @IsNotEmpty()
  idCustomer!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsNumber()
  @IsNotEmpty()
  baseFee!: number;

  @IsNumber()
  @IsNotEmpty()
  deliveryFee!: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status!: TransactionStatus;
}
