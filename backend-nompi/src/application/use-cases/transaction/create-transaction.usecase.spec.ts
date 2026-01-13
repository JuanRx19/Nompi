import { CreateTransactionUseCase } from './create-transaction.usecase';
import type { TransactionRepository } from '../../../domain/ports/repositories/transaction.repository';
import type { IIdGenerator } from '../../services/id-generator.service';
import { CreateTransactionDto } from '../../dto/transaction.dto';
import { TransactionStatus } from '../../../domain/enums/transactionStatusEnum';

describe('CreateTransactionUseCase', () => {
  it('crea transaction, guarda y retorna dto', async () => {
    const repository: jest.Mocked<TransactionRepository> = {
      findById: jest.fn(),
      findByCustomerId: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };

    const idGenerator: jest.Mocked<IIdGenerator> = {
      generate: jest.fn().mockReturnValue('tx-id'),
    };

    const useCase = new CreateTransactionUseCase(repository, idGenerator);

    const dto = new CreateTransactionDto();
    dto.idProduct = 'p1';
    dto.idCustomer = 'c1';
    dto.amount = 10;
    dto.baseFee = 1;
    dto.deliveryFee = 2;
    dto.totalAmount = 13;
    dto.status = TransactionStatus.PAID;
    dto.idNompiTransaction = 'nompi-1';

    const result = await useCase.execute(dto);

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('tx-id');
    expect(result.status).toBe(TransactionStatus.PAID);
  });
});
