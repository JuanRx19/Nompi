import { PrismaCustomerRepository } from './prisma-customer.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '../../../../domain/models/customer';

describe('PrismaCustomerRepository', () => {
  it('findById retorna null si no existe', async () => {
    const prisma = {
      customer: { findUnique: jest.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const repo = new PrismaCustomerRepository(prisma);
    await expect(repo.findById('c1')).resolves.toBeNull();
  });

  it('findByEmail mapea a dominio', async () => {
    const prisma = {
      customer: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'c1',
          name: 'N',
          email: 'n@test.com',
          document: '1',
        }),
      },
    } as unknown as PrismaService;

    const repo = new PrismaCustomerRepository(prisma);
    const customer = await repo.findByEmail('n@test.com');

    expect(customer).toBeInstanceOf(Customer);
    expect(customer?.id).toBe('c1');
  });

  it('findByEmail retorna null si no existe', async () => {
    const prisma = {
      customer: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const repo = new PrismaCustomerRepository(prisma);
    await expect(repo.findByEmail('x@test.com')).resolves.toBeNull();
  });

  it('findById mapea a dominio cuando existe', async () => {
    const prisma = {
      customer: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'c1',
          name: 'N',
          email: 'n@test.com',
          document: '1',
        }),
      },
    } as unknown as PrismaService;

    const repo = new PrismaCustomerRepository(prisma);
    const customer = await repo.findById('c1');
    expect(customer?.email).toBe('n@test.com');
  });

  it('save hace upsert con datos del dominio', async () => {
    const upsert = jest.fn().mockResolvedValue(undefined);
    const prisma = {
      customer: {
        upsert,
      },
    } as unknown as PrismaService;

    const repo = new PrismaCustomerRepository(prisma);
    await repo.save(new Customer('c1', 'N', 'n@test.com', '1'));

    expect(upsert).toHaveBeenCalledTimes(1);
  });
});
