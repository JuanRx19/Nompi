import { PaymentDto } from 'src/application/dto/payment.dto';

export const PaymentGatewayToken = Symbol('PaymentGateway');

export interface IPaymentGateway {
  getNompiUrl(payment_detail: PaymentDto): Promise<PaymentDto | null>;
}
