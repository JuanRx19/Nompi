import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateCustomerDto,
  CustomerDto,
} from '../../../application/dto/customer.dto';
import { CreateCustomerUseCase } from '../../../application/use-cases/customer/create-customer.usecase';

@Controller('customers')
export class CustomersController {
  constructor(private readonly createCustomer: CreateCustomerUseCase) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerDto> {
    return await this.createCustomer.execute(dto);
  }
}
