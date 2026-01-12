import type { IProductRepository } from '../../../domain/ports/repositories/product.repository';
import { ProductDto } from '../../dto/product.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ProductRepositoryToken } from '../../../domain/ports/repositories/product.repository';
import { ProductMapper } from '../../../infrastructure/adapters/mappers/product.mapper';

@Injectable()
export class SaveProductUseCase {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: IProductRepository,
  ) {}

  async execute(dto: ProductDto): Promise<void> {
    const product = ProductMapper.toDomain(dto);
    await this.repository.save(product);
  }
}
