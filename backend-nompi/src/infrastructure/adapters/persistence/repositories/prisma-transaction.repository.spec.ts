import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus as PrismaTransactionStatus } from '@prisma/client';
import { TransactionStatus } from '../../../../domain/enums/transactionStatusEnum';
import { Transaction } from '../../../../domain/models/transaction';

describe('PrismaTransactionRepository', () => {
  it('findById retorna null si no existe', async () => {
    const prisma = {
      transaction: { findUnique: jest.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const repo = new PrismaTransactionRepository(prisma);
    await expect(repo.findById('t1')).resolves.toBeNull();
  });

  it('findById mapea status y montos a number', async () => {
    const prisma = {
      transaction: {
        findUnique: jest.fn().mockResolvedValue({
          id: 't1',
          idProduct: 'p1',
          idCustomer: 'c1',
          amount: { toNumber: () => 10 },
          baseFee: { toNumber: () => 1 },
          deliveryFee: { toNumber: () => 2 },
          totalAmount: { toNumber: () => 13 },
          status: PrismaTransactionStatus.PAID,
          idNompiTransaction: 1,
        }),
      },
    } as unknown as PrismaService;

    const repo = new PrismaTransactionRepository(prisma);
    const tx = await repo.findById('t1');

    expect(tx?.amount).toBe(10);
    expect(tx?.status).toBe(TransactionStatus.PAID);
  });

  it('findByCustomerId mapea lista y cubre status FAILED', async () => {
    const prisma = {
      transaction: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 't1',
            idProduct: 'p1',
            idCustomer: 'c1',
            amount: { toNumber: () => 10 },
            baseFee: { toNumber: () => 1 },
            deliveryFee: { toNumber: () => 2 },
            totalAmount: { toNumber: () => 13 },
            status: PrismaTransactionStatus.FAILED,
            idNompiTransaction: null,
          },
        ]),
      },
    } as unknown as PrismaService;

    const repo = new PrismaTransactionRepository(prisma);
    const list = await repo.findByCustomerId('c1');
    expect(list).toHaveLength(1);
    expect(list[0].status).toBe(TransactionStatus.FAILED);
  });

  it('cubre defaults en mapping de status (cast)', async () => {
    const prisma = {
      transaction: {
        findUnique: jest.fn().mockResolvedValue({
          id: 't1',
          idProduct: 'p1',
          idCustomer: 'c1',
          amount: { toNumber: () => 10 },
          baseFee: { toNumber: () => 1 },
          deliveryFee: { toNumber: () => 2 },
          totalAmount: { toNumber: () => 13 },
          status: 'UNKNOWN' as any,
          idNompiTransaction: 1,
        }),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
    } as unknown as PrismaService;

    const repo = new PrismaTransactionRepository(prisma);
    const tx = await repo.findById('t1');
    expect(tx?.status).toBe(TransactionStatus.FAILED);

    await repo.save(
      new Transaction('t1', 'p1', 'c1', 10, 1, 2, 13, 'UNKNOWN' as any, 'n1'),
    );

    expect((prisma as any).transaction.upsert).toHaveBeenCalled();
  });

  it('save hace upsert con status mapeado', async () => {
    const upsert = jest.fn().mockResolvedValue(undefined);
    const prisma = {
      transaction: { upsert },
    } as unknown as PrismaService;

    const repo = new PrismaTransactionRepository(prisma);

    await repo.save(
      new Transaction(
        't1',
        'p1',
        'c1',
        10,
        1,
        2,
        13,
        TransactionStatus.FAILED,
        'n1',
      ),
    );

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert.mock.calls[0][0].create.status).toBe(
      PrismaTransactionStatus.FAILED,
    );
  });
});
