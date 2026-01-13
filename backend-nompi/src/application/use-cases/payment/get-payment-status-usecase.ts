import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentGateway } from '../../../domain/ports/gateways/payment-gateway.port';
import { PaymentGatewayToken } from '../../../domain/ports/gateways/payment-gateway.port';
import { PaymentDto } from 'src/application/dto/payment.dto';
import { TransactionService } from 'src/application/services/transaction.service';

@Injectable()
export class GetPaymentStatusUseCase {
  constructor(
    @Inject(PaymentGatewayToken)
    private readonly gateway: IPaymentGateway,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(id_transaction: string): Promise<PaymentDto | null> {
    const nompi = await this.gateway.getTransaction(id_transaction);
    if (!nompi) return null;

    const { data } = nompi;

    if (data.status === 'APPROVED') {
      const paymentLink = await this.gateway.getProductReference(
        data.payment_link_id,
      );
      const sku = paymentLink?.data?.sku;

      if (sku) {
        await this.transactionService.onApprovedNompiTransaction({
          externalTransactionId: data.id,
          amountInCents: data.amount_in_cents,
          productSku: sku,
          merchant: data.merchant,
          idTransaction: id_transaction,
        });
      }
    }

    const paymentData = new PaymentDto();
    paymentData.status = data.status;
    return paymentData;
  }
}
