import { Product } from '../../models/product';

export const ProductRepositoryToken = Symbol('ProductRepository');

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findActive(): Promise<Product[]>;
  save(product: Product): Promise<void>;
  decrementStock(productId: string, quantity: number): Promise<boolean>;
}
