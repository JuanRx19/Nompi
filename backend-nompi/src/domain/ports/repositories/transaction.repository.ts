import { Transaction } from '../../models/transaction';

export const TransactionRepositoryToken = Symbol('TransactionRepository');

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
  findByCustomerId(customerId: string): Promise<Transaction[]>;
}
