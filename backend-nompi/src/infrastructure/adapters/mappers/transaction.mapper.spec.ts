import { TransactionMapper } from './transaction.mapper';
import { TransactionStatus } from '../../../domain/enums/transactionStatusEnum';
import { Transaction } from '../../../domain/models/transaction';

describe('TransactionMapper', () => {
  it('toDomain mapea CreateTransactionDto', () => {
    const domain = TransactionMapper.toDomain({
      idProduct: 'p1',
      idCustomer: 'c1',
      amount: 10,
      baseFee: 1,
      deliveryFee: 2,
      totalAmount: 13,
      status: TransactionStatus.PAID,
      idNompiTransaction: 'nompi-1',
    } as any);

    expect(domain.id).toBe('');
    expect(domain.totalAmount).toBe(13);
  });

  it('toDto mapea entidad', () => {
    const tx = new Transaction(
      't1',
      'p1',
      'c1',
      10,
      1,
      2,
      13,
      TransactionStatus.FAILED,
      'nompi-1',
    );

    const dto = TransactionMapper.toDto(tx);
    expect(dto.id).toBe('t1');
    expect(dto.status).toBe(TransactionStatus.FAILED);
  });

  it('toDomain mapea TransactionDto con id', () => {
    const domain = TransactionMapper.toDomain({
      id: 't1',
      idProduct: 'p1',
      idCustomer: 'c1',
      amount: 10,
      baseFee: 1,
      deliveryFee: 2,
      totalAmount: 13,
      status: TransactionStatus.PAID,
      idNompiTransaction: 'nompi-1',
    } as any);

    expect(domain.id).toBe('t1');
  });
});
