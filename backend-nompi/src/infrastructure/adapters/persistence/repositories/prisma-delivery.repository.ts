import { Injectable } from '@nestjs/common';
import { Delivery } from '../../../../domain/models/delivery';
import type { DeliveryStatus } from '../../../../domain/enums/deliveryStatusEnum';
import type { DeliveryRepository } from '../../../../domain/ports/repositories/delivery.repository';
import { PrismaService } from '../prisma/prisma.service';

type PrismaDeliveryStatus = DeliveryStatus;

@Injectable()
export class PrismaDeliveryRepository implements DeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomainStatus(status: PrismaDeliveryStatus): DeliveryStatus {
    return status;
  }

  private toPrismaStatus(status: DeliveryStatus): PrismaDeliveryStatus {
    return status;
  }

  async findById(id: string): Promise<Delivery | null> {
    const row = await this.prisma.delivery.findUnique({ where: { id } });
    if (!row) return null;

    return new Delivery(
      row.id,
      row.idTransaction,
      row.address,
      row.city,
      row.phone,
      this.toDomainStatus(row.status),
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
      this.toDomainStatus(row.status),
    );
  }

  async save(delivery: Delivery): Promise<void> {
    await this.prisma.delivery.upsert({
      where: { idTransaction: delivery.idTransaction },
      update: {
        address: delivery.address,
        city: delivery.city,
        phone: delivery.phone,
        status: this.toPrismaStatus(delivery.status),
      },
      create: {
        id: delivery.id,
        idTransaction: delivery.idTransaction,
        address: delivery.address,
        city: delivery.city,
        phone: delivery.phone,
        status: this.toPrismaStatus(delivery.status),
      },
    });
  }
}
