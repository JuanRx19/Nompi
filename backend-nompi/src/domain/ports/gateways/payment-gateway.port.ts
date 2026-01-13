import { PaymentLinkDto } from 'src/application/dto/payment-link.dto';
import { PaymentDto } from 'src/application/dto/payment.dto';
import { NompiTransactionResponseDto } from 'src/application/dto/nompi-transaction-response.dto';

export const PaymentGatewayToken = Symbol('PaymentGateway');

export interface IPaymentGateway {
  getNompiUrl(payment_detail: PaymentDto): Promise<PaymentDto | null>;
  getTransaction(id: string): Promise<NompiTransactionResponseDto | null>;
  getProductReference(id: string): Promise<PaymentLinkDto | null>;
}
