import { GetAllProductsUseCase } from './get-all-products.usecase';
import type { IProductRepository } from '../../../domain/ports/repositories/product.repository';
import { Product } from '../../../domain/models/product';

describe('GetAllProductsUseCase', () => {
  it('retorna null si el repo retorna null', async () => {
    const repository = {
      findAll: jest.fn().mockResolvedValue(null),
    } as unknown as IProductRepository;

    const useCase = new GetAllProductsUseCase(repository);
    await expect(useCase.execute()).resolves.toBeNull();
  });

  it('mapea a DTOs cuando hay productos', async () => {
    const repository = {
      findAll: jest
        .fn()
        .mockResolvedValue([new Product('p1', 'P', 'D', 10, 2, 'img', false)]),
    } as unknown as IProductRepository;

    const useCase = new GetAllProductsUseCase(repository);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result?.[0].id).toBe('p1');
  });
});
