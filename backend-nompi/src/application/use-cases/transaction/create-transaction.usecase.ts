import { Inject, Injectable } from '@nestjs/common';
import {
  IdGeneratorToken,
  type IIdGenerator,
} from '../../services/id-generator.service';
import {
  CreateTransactionDto,
  TransactionDto,
} from '../../dto/transaction.dto';
import {
  TransactionRepositoryToken,
  type TransactionRepository,
} from '../../../domain/ports/repositories/transaction.repository';
import { Transaction } from '../../../domain/models/transaction';
import { TransactionMapper } from '../../../infrastructure/adapters/mappers/transaction.mapper';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TransactionRepositoryToken)
    private readonly repository: TransactionRepository,
    @Inject(IdGeneratorToken)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<TransactionDto> {
    const transaction = new Transaction(
      this.idGenerator.generate(),
      dto.idProduct,
      dto.idCustomer,
      dto.amount,
      dto.baseFee,
      dto.deliveryFee,
      dto.totalAmount,
      dto.status,
      dto.idNompiTransaction,
    );

    await this.repository.save(transaction);

    return TransactionMapper.toDto(transaction);
  }
}
