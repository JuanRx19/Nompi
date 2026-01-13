import { PrismaDeliveryRepository } from './prisma-delivery.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Delivery } from '../../../../domain/models/delivery';
import { DeliveryStatus } from '../../../../domain/enums/deliveryStatusEnum';

describe('PrismaDeliveryRepository', () => {
  it('findById retorna null si no existe', async () => {
    const prisma = {
      delivery: { findUnique: jest.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const repo = new PrismaDeliveryRepository(prisma);
    await expect(repo.findById('d1')).resolves.toBeNull();
  });

  it('findByTransactionId mapea a dominio', async () => {
    const prisma = {
      delivery: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'd1',
          idTransaction: 'tx1',
          address: 'a',
          city: 'c',
          phone: 'p',
          status: 'PENDING',
        }),
      },
    } as unknown as PrismaService;

    const repo = new PrismaDeliveryRepository(prisma);
    const delivery = await repo.findByTransactionId('tx1');

    expect(delivery).toBeInstanceOf(Delivery);
    expect(delivery?.status).toBe(DeliveryStatus.PENDING);
  });

  it('findByTransactionId retorna null si no existe', async () => {
    const prisma = {
      delivery: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const repo = new PrismaDeliveryRepository(prisma);
    await expect(repo.findByTransactionId('tx1')).resolves.toBeNull();
  });

  it('findById mapea a dominio cuando existe', async () => {
    const prisma = {
      delivery: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'd1',
          idTransaction: 'tx1',
          address: 'a',
          city: 'c',
          phone: 'p',
          status: 'SHIPPED',
        }),
      },
    } as unknown as PrismaService;

    const repo = new PrismaDeliveryRepository(prisma);
    const delivery = await repo.findById('d1');
    expect(delivery?.status).toBe(DeliveryStatus.SHIPPED);
  });

  it('save hace upsert por idTransaction', async () => {
    const upsert = jest.fn().mockResolvedValue(undefined);
    const prisma = {
      delivery: { upsert },
    } as unknown as PrismaService;

    const repo = new PrismaDeliveryRepository(prisma);
    await repo.save(
      new Delivery('d1', 'tx1', 'a', 'c', 'p', DeliveryStatus.PENDING),
    );

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert.mock.calls[0][0].where).toEqual({ idTransaction: 'tx1' });
  });
});
