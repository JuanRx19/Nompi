import { Injectable } from '@nestjs/common';
import { TransactionStatus as PrismaTransactionStatus } from '@prisma/client';
import { Transaction } from '../../../../domain/models/transaction';
import { TransactionStatus as DomainTransactionStatus } from '../../../../domain/enums/transactionStatusEnum';
import type { TransactionRepository } from '../../../../domain/ports/repositories/transaction.repository';
import { PrismaService } from '../prisma/prisma.service';

const toDomainStatus = (
  status: PrismaTransactionStatus,
): DomainTransactionStatus => {
  switch (status) {
    case PrismaTransactionStatus.PAID:
      return DomainTransactionStatus.PAID;
    case PrismaTransactionStatus.FAILED:
      return DomainTransactionStatus.FAILED;
    default:
      return DomainTransactionStatus.FAILED;
  }
};

const toPrismaStatus = (
  status: DomainTransactionStatus,
): PrismaTransactionStatus => {
  switch (status) {
    case DomainTransactionStatus.PAID:
      return PrismaTransactionStatus.PAID;
    case DomainTransactionStatus.FAILED:
      return PrismaTransactionStatus.FAILED;
    default:
      return PrismaTransactionStatus.FAILED;
  }
};

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    const row = await this.prisma.transaction.findUnique({ where: { id } });
    if (!row) return null;

    return new Transaction(
      row.id,
      row.idProduct,
      row.idCustomer,
      row.amount.toNumber(),
      row.baseFee.toNumber(),
      row.deliveryFee.toNumber(),
      row.totalAmount.toNumber(),
      toDomainStatus(row.status),
      String(row.idNompiTransaction),
    );
  }

  async findByCustomerId(customerId: string): Promise<Transaction[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { idCustomer: customerId },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(
      (row) =>
        new Transaction(
          row.id,
          row.idProduct,
          row.idCustomer,
          row.amount.toNumber(),
          row.baseFee.toNumber(),
          row.deliveryFee.toNumber(),
          row.totalAmount.toNumber(),
          toDomainStatus(row.status),
          String(row.idNompiTransaction),
        ),
    );
  }

  async save(transaction: Transaction): Promise<void> {
    const prismaStatus = toPrismaStatus(transaction.status);
    await this.prisma.transaction.upsert({
      where: { id: transaction.id },
      update: {
        idProduct: transaction.idProduct,
        idCustomer: transaction.idCustomer,
        amount: transaction.amount,
        baseFee: transaction.baseFee,
        deliveryFee: transaction.deliveryFee,
        totalAmount: transaction.totalAmount,
        status: prismaStatus,
        idNompiTransaction: transaction.idNompiTransaction,
      },
      create: {
        id: transaction.id,
        idProduct: transaction.idProduct,
        idCustomer: transaction.idCustomer,
        amount: transaction.amount,
        baseFee: transaction.baseFee,
        deliveryFee: transaction.deliveryFee,
        totalAmount: transaction.totalAmount,
        status: prismaStatus,
        idNompiTransaction: transaction.idNompiTransaction,
      },
    });
  }
}
