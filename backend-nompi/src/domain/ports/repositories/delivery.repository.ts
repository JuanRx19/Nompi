import { Delivery } from '../../models/delivery';

export const DeliveryRepositoryToken = Symbol('DeliveryRepository');

export interface DeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
  save(delivery: Delivery): Promise<void>;
}
