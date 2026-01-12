import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IProductRepository } from '../../../../domain/ports/repositories/product.repository';
import { Product } from '../../../../domain/models/product';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!p) return null;

    return new Product(
      p.id,
      p.name,
      p.description,
      p.price.toNumber(),
      p.stock,
      p.imageUrl,
      p.deleted,
    );
  }

  async findAll(): Promise<Product[]> {
    const results = await this.prisma.product.findMany();
    return results.map(
      (p) =>
        new Product(
          p.id,
          p.name,
          p.description,
          p.price.toNumber(),
          p.stock,
          p.imageUrl,
          p.deleted,
        ),
    );
  }

  async findActive(): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: { deleted: false },
    });

    return results.map(
      (p) =>
        new Product(
          p.id,
          p.name,
          p.description,
          p.price.toNumber(),
          p.stock,
          p.imageUrl,
          p.deleted,
        ),
    );
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        deleted: product.deleted,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        deleted: product.deleted,
      },
    });
  }
}
