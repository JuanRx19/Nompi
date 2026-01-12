import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentGateway } from '../../../domain/ports/gateways/payment-gateway.port';
import { PaymentGatewayToken } from '../../../domain/ports/gateways/payment-gateway.port';
import { PaymentDto } from 'src/application/dto/payment.dto';

@Injectable()
export class GetPaymentUrlUseCase {
  constructor(
    @Inject(PaymentGatewayToken)
    private readonly gateway: IPaymentGateway,
  ) {}

  async execute(payment_data: PaymentDto): Promise<PaymentDto | null> {
    return await this.gateway.getNompiUrl(payment_data);
  }
}
