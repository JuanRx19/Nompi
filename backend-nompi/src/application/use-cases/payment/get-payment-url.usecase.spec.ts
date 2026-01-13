import { GetPaymentUrlUseCase } from './get-payment-url.usecase';
import type { IPaymentGateway } from '../../../domain/ports/gateways/payment-gateway.port';
import { PaymentDto } from '../../dto/payment.dto';

describe('GetPaymentUrlUseCase', () => {
  it('delegates to gateway.getNompiUrl', async () => {
    const gateway: jest.Mocked<IPaymentGateway> = {
      getNompiUrl: jest.fn().mockResolvedValue(new PaymentDto()),
      getTransaction: jest.fn(),
      getProductReference: jest.fn(),
    };

    const useCase = new GetPaymentUrlUseCase(gateway);
    const dto = new PaymentDto();

    await useCase.execute(dto);

    expect(gateway.getNompiUrl).toHaveBeenCalledWith(dto);
  });
});
