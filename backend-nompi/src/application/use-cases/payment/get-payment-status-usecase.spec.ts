import { GetPaymentStatusUseCase } from './get-payment-status-usecase';
import type { IPaymentGateway } from '../../../domain/ports/gateways/payment-gateway.port';
import { PaymentDto } from '../../dto/payment.dto';
import type { TransactionService } from '../../services/transaction.service';

describe('GetPaymentStatusUseCase', () => {
  it('retorna null si gateway no retorna transacción', async () => {
    const gateway: jest.Mocked<IPaymentGateway> = {
      getNompiUrl: jest.fn(),
      getTransaction: jest.fn().mockResolvedValue(null),
      getProductReference: jest.fn(),
    };

    const transactionService = {
      onApprovedNompiTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>;

    const useCase = new GetPaymentStatusUseCase(gateway, transactionService);
    await expect(useCase.execute('id')).resolves.toBeNull();
  });

  it('si está APPROVED y hay sku, notifica TransactionService', async () => {
    const gateway: jest.Mocked<IPaymentGateway> = {
      getNompiUrl: jest.fn(),
      getTransaction: jest.fn().mockResolvedValue({
        data: {
          id: 'ext-1',
          amount_in_cents: 1000,
          status: 'APPROVED',
          merchant: { name: 'N', email: 'n@test.com', legal_id: '1' },
          payment_link_id: 'pl_1',
        },
      }),
      getProductReference: jest.fn().mockResolvedValue({
        data: { sku: 'sku-1' },
      }),
    };

    const transactionService = {
      onApprovedNompiTransaction: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<TransactionService>;

    const useCase = new GetPaymentStatusUseCase(gateway, transactionService);
    const result = await useCase.execute('nompi-id');

    expect(result).toBeInstanceOf(PaymentDto);
    expect(result?.status).toBe('APPROVED');
    expect(gateway.getProductReference).toHaveBeenCalledWith('pl_1');
    expect(transactionService.onApprovedNompiTransaction).toHaveBeenCalledTimes(
      1,
    );
  });

  it('si está APPROVED pero no hay sku, no notifica TransactionService', async () => {
    const gateway: jest.Mocked<IPaymentGateway> = {
      getNompiUrl: jest.fn(),
      getTransaction: jest.fn().mockResolvedValue({
        data: {
          id: 'ext-1',
          amount_in_cents: 1000,
          status: 'APPROVED',
          merchant: { name: 'N', email: 'n@test.com', legal_id: '1' },
          payment_link_id: 'pl_1',
        },
      }),
      getProductReference: jest.fn().mockResolvedValue({
        data: { sku: '' },
      }),
    };

    const transactionService = {
      onApprovedNompiTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>;

    const useCase = new GetPaymentStatusUseCase(gateway, transactionService);
    await useCase.execute('nompi-id');

    expect(
      transactionService.onApprovedNompiTransaction,
    ).not.toHaveBeenCalled();
  });
});
