import { Customer } from '../../models/customer';

export const CustomerRepositoryToken = Symbol('CustomerRepository');

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
}
