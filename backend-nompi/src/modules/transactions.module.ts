import { Module } from '@nestjs/common';
import { TransactionsController } from '../infrastructure/adapters/rest/transactions.controller';
import { TransactionRepositoryToken } from '../domain/ports/repositories/transaction.repository';
import { PrismaTransactionRepository } from '../infrastructure/adapters/persistence/repositories/prisma-transaction.repository';
import { CreateTransactionUseCase } from '../application/use-cases/transaction/create-transaction.usecase';
import {
  IdGeneratorToken,
  UuidIdGenerator,
} from '../application/services/id-generator.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: TransactionRepositoryToken,
      useClass: PrismaTransactionRepository,
    },
    { provide: IdGeneratorToken, useClass: UuidIdGenerator },
  ],
})
export class TransactionsModule {}
