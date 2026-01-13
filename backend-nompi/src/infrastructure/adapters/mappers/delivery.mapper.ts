import { Delivery } from '../../../domain/models/delivery';
import {
  CreateDeliveryDto,
  DeliveryDto,
} from '../../../application/dto/delivery.dto';
import { DeliveryStatus as PrismaDeliveryStatus } from '@prisma/client';
import { DeliveryStatus } from '../../../domain/enums/deliveryStatusEnum';

export class DeliveryMapper {
  static toDomain(dto: CreateDeliveryDto | DeliveryDto): Delivery {
    return new Delivery(
      'id' in dto ? dto.id : '',
      dto.idTransaction,
      dto.address,
      dto.city,
      dto.phone,
      dto.status,
    );
  }

  static toDto(delivery: Delivery): DeliveryDto {
    const dto = new DeliveryDto();
    dto.id = delivery.id;
    dto.idTransaction = delivery.idTransaction;
    dto.address = delivery.address;
    dto.city = delivery.city;
    dto.phone = delivery.phone;
    dto.status = delivery.status;
    return dto;
  }

  static toDomainStatus(status: PrismaDeliveryStatus): DeliveryStatus {
    switch (status) {
      case PrismaDeliveryStatus.PENDING:
        return DeliveryStatus.PENDING;
      case PrismaDeliveryStatus.SHIPPED:
        return DeliveryStatus.SHIPPED;
      case PrismaDeliveryStatus.DELIVERED:
        return DeliveryStatus.DELIVERED;
      case PrismaDeliveryStatus.RETURNED:
        return DeliveryStatus.RETURNED;
      default:
        return DeliveryStatus.PENDING;
    }
  }

  static toPrismaStatus(status: DeliveryStatus): PrismaDeliveryStatus {
    switch (status) {
      case DeliveryStatus.PENDING:
        return PrismaDeliveryStatus.PENDING;
      case DeliveryStatus.SHIPPED:
        return PrismaDeliveryStatus.SHIPPED;
      case DeliveryStatus.DELIVERED:
        return PrismaDeliveryStatus.DELIVERED;
      case DeliveryStatus.RETURNED:
        return PrismaDeliveryStatus.RETURNED;
      default:
        return PrismaDeliveryStatus.PENDING;
    }
  }
}
