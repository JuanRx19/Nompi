import { Delivery } from '../../../domain/models/delivery';
import {
  CreateDeliveryDto,
  DeliveryDto,
} from '../../../application/dto/delivery.dto';

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
}
