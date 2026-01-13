import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateTransactionDto,
  TransactionDto,
} from '../../../application/dto/transaction.dto';
import { CreateTransactionUseCase } from '../../../application/use-cases/transaction/create-transaction.usecase';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly createTransaction: CreateTransactionUseCase) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<TransactionDto> {
    return await this.createTransaction.execute(dto);
  }
}
