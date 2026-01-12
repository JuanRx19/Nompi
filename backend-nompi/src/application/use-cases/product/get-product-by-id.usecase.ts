import type { IProductRepository } from '../../../domain/ports/repositories/product.repository';
import { ProductDto } from '../../dto/product.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ProductRepositoryToken } from '../../../domain/ports/repositories/product.repository';
import { ProductMapper } from '../../../infrastructure/adapters/mappers/product.mapper';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: string): Promise<ProductDto | null> {
    const product = await this.repository.findById(id);
    if (!product) {
      return null;
    }
    return ProductMapper.toDto(product);
  }
}
