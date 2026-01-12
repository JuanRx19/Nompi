import { Transaction } from '../../../domain/models/transaction';
import {
  CreateTransactionDto,
  TransactionDto,
} from '../../../application/dto/transaction.dto';

export class TransactionMapper {
  static toDomain(dto: CreateTransactionDto | TransactionDto): Transaction {
    return new Transaction(
      'id' in dto ? dto.id : '',
      dto.idProduct,
      dto.idCustomer,
      dto.amount,
      dto.baseFee,
      dto.deliveryFee,
      dto.totalAmount,
      dto.status,
    );
  }

  static toDto(transaction: Transaction): TransactionDto {
    const dto = new TransactionDto();
    dto.id = transaction.id;
    dto.idProduct = transaction.idProduct;
    dto.idCustomer = transaction.idCustomer;
    dto.amount = transaction.amount;
    dto.baseFee = transaction.baseFee;
    dto.deliveryFee = transaction.deliveryFee;
    dto.totalAmount = transaction.totalAmount;
    dto.status = transaction.status;
    return dto;
  }
}
