import { Module } from '@nestjs/common';
import { CustomersController } from '../infrastructure/adapters/rest/customer.controller';
import {
  CustomerRepositoryToken,
} from '../domain/ports/repositories/customer.repository';
import { PrismaCustomerRepository } from '../infrastructure/adapters/persistence/repositories/prisma-customer.repository';
import { CreateCustomerUseCase } from '../application/use-cases/customer/create-customer.usecase';
import {
  IdGeneratorToken,
  UuidIdGenerator,
} from '../application/services/id-generator.service';

@Module({
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    { provide: CustomerRepositoryToken, useClass: PrismaCustomerRepository },
    { provide: IdGeneratorToken, useClass: UuidIdGenerator },
  ],
})
export class CustomersModule {}
