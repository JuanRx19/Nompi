import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  IdGeneratorToken,
  type IIdGenerator,
} from '../../services/id-generator.service';
import { CreateCustomerDto, CustomerDto } from '../../dto/customer.dto';
import {
  CustomerRepositoryToken,
  type CustomerRepository,
} from '../../../domain/ports/repositories/customer.repository';
import { Customer } from '../../../domain/models/customer';
import { CustomerMapper } from '../../../infrastructure/adapters/mappers/customer.mapper';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CustomerRepositoryToken)
    private readonly repository: CustomerRepository,
    @Inject(IdGeneratorToken)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerDto> {
    const existing = await this.repository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un customer con ese email');
    }

    const customer = new Customer(
      this.idGenerator.generate(),
      dto.name,
      dto.email,
      dto.document,
    );

    await this.repository.save(customer);

    return CustomerMapper.toDto(customer);
  }
}
