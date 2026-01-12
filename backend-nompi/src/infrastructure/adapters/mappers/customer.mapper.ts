import { Customer } from '../../../domain/models/customer';
import {
  CreateCustomerDto,
  CustomerDto,
} from '../../../application/dto/customer.dto';

export class CustomerMapper {
  static toDomain(dto: CreateCustomerDto | CustomerDto): Customer {
    return new Customer(
      'id' in dto ? dto.id : '',
      dto.name,
      dto.email,
      dto.document,
    );
  }

  static toDto(customer: Customer): CustomerDto {
    const dto = new CustomerDto();
    dto.id = customer.id;
    dto.name = customer.name;
    dto.email = customer.email;
    dto.document = customer.document;
    return dto;
  }
}
