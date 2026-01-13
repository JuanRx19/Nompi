import { Injectable } from '@nestjs/common';
import { Delivery } from '../../../../domain/models/delivery';
import type { DeliveryRepository } from '../../../../domain/ports/repositories/delivery.repository';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryMapper } from '../../mappers/delivery.mapper';

@Injectable()
export class PrismaDeliveryRepository implements DeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Delivery | null> {
    const row = await this.prisma.delivery.findUnique({ where: { id } });
    if (!row) return null;

    return new Delivery(
      row.id,
      row.idTransaction,
      row.address,
      row.city,
      row.phone,
      DeliveryMapper.toDomainStatus(row.status),
    );
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const row = await this.prisma.delivery.findUnique({
      where: { idTransaction: transactionId },
    });
    if (!row) return null;

    return new Delivery(
      row.id,
      row.idTransaction,
      row.address,
      row.city,
      row.phone,
      DeliveryMapper.toDomainStatus(row.status),
    );
  }

  async save(delivery: Delivery): Promise<void> {
    await this.prisma.delivery.upsert({
      where: { idTransaction: delivery.idTransaction },
      update: {
        address: delivery.address,
        city: delivery.city,
        phone: delivery.phone,
        status: DeliveryMapper.toPrismaStatus(delivery.status),
      },
      create: {
        id: delivery.id,
        idTransaction: delivery.idTransaction,
        address: delivery.address,
        city: delivery.city,
        phone: delivery.phone,
        status: DeliveryMapper.toPrismaStatus(delivery.status),
      },
    });
  }
}
