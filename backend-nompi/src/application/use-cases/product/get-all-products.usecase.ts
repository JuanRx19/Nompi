import type { IProductRepository } from '../../../domain/ports/repositories/product.repository';
import { ProductDto } from '../../dto/product.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ProductRepositoryToken } from '../../../domain/ports/repositories/product.repository';
import { ProductMapper } from '../../../infrastructure/adapters/mappers/product.mapper';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: IProductRepository,
  ) {}

  async execute(): Promise<ProductDto[] | null> {
    const products = await this.repository.findAll();
    if (!products) {
      return null;
    }
    return ProductMapper.toDtoList(products);
  }
}
