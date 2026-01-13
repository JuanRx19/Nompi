import { Module } from '@nestjs/common';
import { PaymentsController } from '../infrastructure/adapters/rest/payments.controller';
import { HttpModule } from '@nestjs/axios';
import { PaymentGatewayToken } from '.././domain/ports/gateways/payment-gateway.port';
import { PaymentGateway } from '../infrastructure/adapters/gateways/payment-gateway.adapter';
import {
  IdGeneratorToken,
  UuidIdGenerator,
} from '../application/services/id-generator.service';
import { GetPaymentUrlUseCase } from 'src/application/use-cases/payment/get-payment-url.usecase';
import { GetPaymentStatusUseCase } from 'src/application/use-cases/payment/get-payment-status-usecase';
import { TransactionService } from 'src/application/services/transaction.service';
import { CustomerRepositoryToken } from 'src/domain/ports/repositories/customer.repository';
import { ProductRepositoryToken } from 'src/domain/ports/repositories/product.repository';
import { TransactionRepositoryToken } from 'src/domain/ports/repositories/transaction.repository';
import { DeliveryRepositoryToken } from 'src/domain/ports/repositories/delivery.repository';
import { PrismaCustomerRepository } from 'src/infrastructure/adapters/persistence/repositories/prisma-customer.repository';
import { ProductRepository } from 'src/infrastructure/adapters/persistence/repositories/prisma-product.repository';
import { PrismaTransactionRepository } from 'src/infrastructure/adapters/persistence/repositories/prisma-transaction.repository';
import { PrismaDeliveryRepository } from 'src/infrastructure/adapters/persistence/repositories/prisma-delivery.repository';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [
    GetPaymentUrlUseCase,
    GetPaymentStatusUseCase,
    TransactionService,
    { provide: PaymentGatewayToken, useClass: PaymentGateway },
    { provide: IdGeneratorToken, useClass: UuidIdGenerator },
    { provide: CustomerRepositoryToken, useClass: PrismaCustomerRepository },
    { provide: ProductRepositoryToken, useClass: ProductRepository },
    {
      provide: TransactionRepositoryToken,
      useClass: PrismaTransactionRepository,
    },
    { provide: DeliveryRepositoryToken, useClass: PrismaDeliveryRepository },
  ],
})
export class PaymentsModule {}
