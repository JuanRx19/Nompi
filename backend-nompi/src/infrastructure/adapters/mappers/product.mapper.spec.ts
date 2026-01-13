import { Product } from '../../../domain/models/product';
import { ProductMapper } from './product.mapper';

describe('ProductMapper', () => {
  it('toDomain aplica defaults si faltan campos opcionales', () => {
    const domain = ProductMapper.toDomain({
      id: 'p1',
      name: 'P',
      price: 10,
      stock: 2,
    } as any);

    expect(domain.description).toBe('');
    expect(domain.imageUrl).toBe('');
    expect(domain.deleted).toBe(false);
  });

  it('toDto preserva todos los campos', () => {
    const product = new Product('p1', 'P', 'D', 10, 2, 'img', true);
    const dto = ProductMapper.toDto(product);

    expect(dto).toEqual({
      id: 'p1',
      name: 'P',
      description: 'D',
      price: 10,
      stock: 2,
      imageUrl: 'img',
      deleted: true,
    });
  });

  it('toDtoList mapea lista completa', () => {
    const products = [new Product('p1', 'P', '', 10, 2, '', false)];
    const dtos = ProductMapper.toDtoList(products);
    expect(dtos).toHaveLength(1);
    expect(dtos[0].id).toBe('p1');
  });
});
