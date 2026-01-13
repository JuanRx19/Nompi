import { DeliveryStatus as PrismaDeliveryStatus } from '@prisma/client';
import { DeliveryStatus } from '../../../domain/enums/deliveryStatusEnum';
import { Delivery } from '../../../domain/models/delivery';
import { DeliveryMapper } from './delivery.mapper';

describe('DeliveryMapper', () => {
  it('toDomain maneja CreateDeliveryDto sin id y DeliveryDto con id', () => {
    const created = DeliveryMapper.toDomain({
      idTransaction: 'tx1',
      address: 'a',
      city: 'c',
      phone: 'p',
      status: DeliveryStatus.PENDING,
    } as any);

    expect(created.id).toBe('');

    const withId = DeliveryMapper.toDomain({
      id: 'd1',
      idTransaction: 'tx1',
      address: 'a',
      city: 'c',
      phone: 'p',
      status: DeliveryStatus.PENDING,
    } as any);

    expect(withId.id).toBe('d1');
  });

  it('mapea status de Prisma a Dominio', () => {
    expect(DeliveryMapper.toDomainStatus(PrismaDeliveryStatus.PENDING)).toBe(
      DeliveryStatus.PENDING,
    );
    expect(DeliveryMapper.toDomainStatus(PrismaDeliveryStatus.SHIPPED)).toBe(
      DeliveryStatus.SHIPPED,
    );
    expect(DeliveryMapper.toDomainStatus(PrismaDeliveryStatus.DELIVERED)).toBe(
      DeliveryStatus.DELIVERED,
    );
    expect(DeliveryMapper.toDomainStatus(PrismaDeliveryStatus.RETURNED)).toBe(
      DeliveryStatus.RETURNED,
    );
  });

  it('mapea status de Dominio a Prisma', () => {
    expect(DeliveryMapper.toPrismaStatus(DeliveryStatus.PENDING)).toBe(
      PrismaDeliveryStatus.PENDING,
    );
    expect(DeliveryMapper.toPrismaStatus(DeliveryStatus.SHIPPED)).toBe(
      PrismaDeliveryStatus.SHIPPED,
    );
    expect(DeliveryMapper.toPrismaStatus(DeliveryStatus.DELIVERED)).toBe(
      PrismaDeliveryStatus.DELIVERED,
    );
    expect(DeliveryMapper.toPrismaStatus(DeliveryStatus.RETURNED)).toBe(
      PrismaDeliveryStatus.RETURNED,
    );
  });

  it('cubre defaults en mapping de status (cast)', () => {
    expect(DeliveryMapper.toDomainStatus('UNKNOWN' as any)).toBe(
      DeliveryStatus.PENDING,
    );
    expect(DeliveryMapper.toPrismaStatus('UNKNOWN' as any)).toBe(
      PrismaDeliveryStatus.PENDING,
    );
  });

  it('mapea entidad a DTO', () => {
    const delivery = new Delivery(
      'd1',
      'tx1',
      'addr',
      'city',
      'phone',
      DeliveryStatus.PENDING,
    );

    const dto = DeliveryMapper.toDto(delivery);
    expect(dto).toEqual({
      id: 'd1',
      idTransaction: 'tx1',
      address: 'addr',
      city: 'city',
      phone: 'phone',
      status: DeliveryStatus.PENDING,
    });
  });
});
