import { Module } from '@nestjs/common';
import { ProductsController } from '../infrastructure/adapters/rest/product.controller';
import { SaveProductUseCase } from '.././application/use-cases/product/save-product.usecase';
import { GetProductByIdUseCase } from '.././application/use-cases/product/get-product-by-id.usecase';
import { ProductRepository } from '../infrastructure/adapters/persistence/repositories/prisma-product.repository';
import { ProductRepositoryToken } from '../domain/ports/repositories/product.repository';
import { GetAllProductsUseCase } from 'src/application/use-cases/product/get-all-products.usecase';

@Module({
  controllers: [ProductsController],
  providers: [
    SaveProductUseCase,
    GetProductByIdUseCase,
    GetAllProductsUseCase,
    {
      provide: ProductRepositoryToken,
      useClass: ProductRepository,
    },
  ],
  exports: [
    SaveProductUseCase,
    {
      provide: ProductRepositoryToken,
      useClass: ProductRepository,
    },
  ],
})
export class ProductsModule {}
