import { SaveProductUseCase } from './save-product.usecase';
import type { IProductRepository } from '../../../domain/ports/repositories/product.repository';
import { ProductDto } from '../../dto/product.dto';

describe('SaveProductUseCase', () => {
  it('mapea a dominio y guarda', async () => {
    const repository = {
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as IProductRepository;

    const useCase = new SaveProductUseCase(repository);

    const dto = new ProductDto();
    dto.id = 'p1';
    dto.name = 'P';
    dto.description = 'D';
    dto.price = 10;
    dto.stock = 2;
    dto.imageUrl = 'img';
    dto.deleted = false;

    await useCase.execute(dto);

    expect(repository.save).toHaveBeenCalledTimes(1);
    const saved = (repository.save as jest.Mock).mock.calls[0][0];
    expect(saved.id).toBe('p1');
  });
});
