import { CreateCustomerDto, CustomerDto } from './customer.dto';
import { CreateDeliveryDto, DeliveryDto } from './delivery.dto';
import { PaymentDto } from './payment.dto';
import { PaymentLinkDto } from './payment-link.dto';
import { NompiTransactionResponseDto } from './nompi-transaction-response.dto';
import { CreatePaymentDto } from './create-payment.dto';
import { ProductDto } from './product.dto';
import { SimulatePaymentDto } from './simulate-payment.dto';
import { CreateTransactionDto, TransactionDto } from './transaction.dto';

describe('DTOs smoke', () => {
  it('pueden instanciarse', () => {
    expect(new CreateCustomerDto()).toBeInstanceOf(CreateCustomerDto);
    expect(new CustomerDto()).toBeInstanceOf(CustomerDto);
    expect(new CreateDeliveryDto()).toBeInstanceOf(CreateDeliveryDto);
    expect(new DeliveryDto()).toBeInstanceOf(DeliveryDto);
    expect(new PaymentDto()).toBeInstanceOf(PaymentDto);
    expect(new PaymentLinkDto()).toBeInstanceOf(PaymentLinkDto);
    expect(new NompiTransactionResponseDto()).toBeInstanceOf(
      NompiTransactionResponseDto,
    );
    expect(new CreatePaymentDto()).toBeInstanceOf(CreatePaymentDto);
    expect(new ProductDto()).toBeInstanceOf(ProductDto);
    expect(new SimulatePaymentDto()).toBeInstanceOf(SimulatePaymentDto);
    expect(new CreateTransactionDto()).toBeInstanceOf(CreateTransactionDto);
    expect(new TransactionDto()).toBeInstanceOf(TransactionDto);
  });
});
