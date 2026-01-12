import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
