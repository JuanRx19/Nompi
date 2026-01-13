import { ProductRepository } from './prisma-product.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../../../domain/models/product';

describe('ProductRepository (Prisma)', () => {
  it('findById retorna null si no existe', async () => {
    const prisma = {
      product: { findUnique: jest.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const repo = new ProductRepository(prisma);
    await expect(repo.findById('p1')).resolves.toBeNull();
  });

  it('findAll mapea lista', async () => {
    const prisma = {
      product: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'p1',
            name: 'P',
            description: 'D',
            price: { toNumber: () => 10 },
            stock: 2,
            imageUrl: 'img',
            deleted: false,
          },
        ]),
      },
    } as unknown as PrismaService;

    const repo = new ProductRepository(prisma);
    const products = await repo.findAll();

    expect(products[0]).toBeInstanceOf(Product);
    expect(products[0].price).toBe(10);
  });

  it('decrementStock retorna true si quantity <= 0', async () => {
    const updateMany = jest.fn();
    const prisma = {
      product: { updateMany },
    } as unknown as PrismaService;

    const repo = new ProductRepository(prisma);
    await expect(repo.decrementStock('p1', 0)).resolves.toBe(true);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it('decrementStock decrementa si hay stock suficiente', async () => {
    const updateMany = jest.fn().mockResolvedValue({ count: 1 });
    const prisma = {
      product: { updateMany },
    } as unknown as PrismaService;

    const repo = new ProductRepository(prisma);
    await expect(repo.decrementStock('p1', 1)).resolves.toBe(true);
    expect(updateMany).toHaveBeenCalledTimes(1);
  });

  it('decrementStock retorna false si no pudo actualizar', async () => {
    const updateMany = jest.fn().mockResolvedValue({ count: 0 });
    const prisma = {
      product: { updateMany },
    } as unknown as PrismaService;

    const repo = new ProductRepository(prisma);
    await expect(repo.decrementStock('p1', 1)).resolves.toBe(false);
  });
});
