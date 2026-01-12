import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsNotEmpty()
  single_use!: boolean;

  @IsString()
  @IsOptional()
  collect_shipping?: boolean;

  @IsNumber()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsOptional()
  amount_in_cents?: number;

  @IsBoolean()
  @IsOptional()
  redirect_url?: string;
}
