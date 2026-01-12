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

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [
    GetPaymentUrlUseCase,
    { provide: PaymentGatewayToken, useClass: PaymentGateway },
    { provide: IdGeneratorToken, useClass: UuidIdGenerator },
  ],
})
export class PaymentsModule {}
