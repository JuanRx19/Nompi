import { GetProductByIdUseCase } from './get-product-by-id.usecase';
import type { IProductRepository } from '../../../domain/ports/repositories/product.repository';
import { Product } from '../../../domain/models/product';

describe('GetProductByIdUseCase', () => {
  it('retorna null si no existe', async () => {
    const repository = {
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as IProductRepository;

    const useCase = new GetProductByIdUseCase(repository);
    await expect(useCase.execute('p1')).resolves.toBeNull();
  });

  it('mapea a DTO si existe', async () => {
    const repository = {
      findById: jest
        .fn()
        .mockResolvedValue(new Product('p1', 'P', 'D', 10, 2, 'img', false)),
    } as unknown as IProductRepository;

    const useCase = new GetProductByIdUseCase(repository);
    const dto = await useCase.execute('p1');

    expect(dto?.id).toBe('p1');
    expect(dto?.name).toBe('P');
  });
});
