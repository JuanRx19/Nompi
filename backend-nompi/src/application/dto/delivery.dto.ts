import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { DeliveryStatus } from '../../domain/enums/deliveryStatusEnum';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  idTransaction!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status!: DeliveryStatus;
}

export class DeliveryDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  idTransaction!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status!: DeliveryStatus;
}
