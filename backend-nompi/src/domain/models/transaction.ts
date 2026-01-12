import { TransactionStatus } from '../enums/transactionStatusEnum';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly idProduct: string,
    public readonly idCustomer: string,
    public readonly amount: number,
    public readonly baseFee: number,
    public readonly deliveryFee: number,
    public readonly totalAmount: number,
    public readonly status: TransactionStatus,
  ) {}
}
