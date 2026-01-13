import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeliveryStatus } from '../../domain/enums/deliveryStatusEnum';
import { TransactionStatus } from '../../domain/enums/transactionStatusEnum';
import { Customer } from '../../domain/models/customer';
import { Delivery } from '../../domain/models/delivery';
import { Transaction } from '../../domain/models/transaction';
import {
  CustomerRepositoryToken,
  type CustomerRepository,
} from '../../domain/ports/repositories/customer.repository';
import {
  TransactionRepositoryToken,
  type TransactionRepository,
} from '../../domain/ports/repositories/transaction.repository';
import {
  DeliveryRepositoryToken,
  type DeliveryRepository,
} from '../../domain/ports/repositories/delivery.repository';
import {
  ProductRepositoryToken,
  type IProductRepository,
} from '../../domain/ports/repositories/product.repository';
import { IdGeneratorToken, type IIdGenerator } from './id-generator.service';
import { MerchantInfo } from '../dto/payment.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @Inject(TransactionRepositoryToken)
    private readonly transactionRepository: TransactionRepository,
    @Inject(DeliveryRepositoryToken)
    private readonly deliveryRepository: DeliveryRepository,
    @Inject(ProductRepositoryToken)
    private readonly productRepository: IProductRepository,
    @Inject(IdGeneratorToken)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async onApprovedNompiTransaction(params: {
    externalTransactionId: string;
    amountInCents: number;
    productSku: string;
    merchant: MerchantInfo;
    idTransaction: string;
    baseFee?: number;
    deliveryFee?: number;
    delivery?: {
      address: string;
      city: string;
      phone: string;
    };
  }): Promise<void> {
    const existingTransaction = await this.transactionRepository.findById(
      params.externalTransactionId,
    );

    const amount = params.amountInCents / 100;
    const baseFee = params.baseFee ?? 0;
    const deliveryFee = params.deliveryFee ?? 0;
    const totalAmount = amount + baseFee + deliveryFee;

    let customerIdForLog: string | undefined;

    if (!existingTransaction) {
      const decremented = await this.productRepository.decrementStock(
        params.productSku,
        1,
      );

      if (!decremented) {
        Logger.warn(
          `No se pudo decrementar stock: productId=${params.productSku} tx=${params.externalTransactionId}`,
          TransactionService.name,
        );
        return;
      }

      const customer = await this.ensureCustomer(params.merchant);
      customerIdForLog = customer.id;

      const transaction = new Transaction(
        params.externalTransactionId,
        params.productSku,
        customer.id,
        amount,
        baseFee,
        deliveryFee,
        totalAmount,
        TransactionStatus.PAID,
        params.idTransaction,
      );

      await this.transactionRepository.save(transaction);
    } else {
      customerIdForLog = existingTransaction.idCustomer;
    }

    const existingDelivery = await this.deliveryRepository.findByTransactionId(
      params.externalTransactionId,
    );
    if (!existingDelivery) {
      const delivery = new Delivery(
        this.idGenerator.generate(),
        params.externalTransactionId,
        params.delivery?.address ?? '',
        params.delivery?.city ?? '',
        params.delivery?.phone ?? '',
        DeliveryStatus.PENDING,
      );

      await this.deliveryRepository.save(delivery);
    }

    Logger.log(
      `Persistencia OK: customer=${customerIdForLog ?? 'unknown'} transaction=${params.externalTransactionId} delivery=${existingDelivery ? 'exists' : 'created'}`,
      TransactionService.name,
    );
  }

  private async ensureCustomer(merchant: MerchantInfo): Promise<Customer> {
    const existing = await this.customerRepository.findByEmail(merchant.email);
    if (existing) return existing;

    const created = new Customer(
      this.idGenerator.generate(),
      merchant.name,
      merchant.email,
      merchant.legal_id,
    );

    await this.customerRepository.save(created);
    return created;
  }
}
