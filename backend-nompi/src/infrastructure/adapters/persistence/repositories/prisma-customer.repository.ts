import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CustomerRepository } from '../../../../domain/ports/repositories/customer.repository';
import { Customer } from '../../../../domain/models/customer';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Customer | null> {
    const row = await this.prisma.customer.findUnique({ where: { id } });
    if (!row) return null;
    return new Customer(row.id, row.name, row.email, row.document);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const row = await this.prisma.customer.findUnique({ where: { email } });
    if (!row) return null;
    return new Customer(row.id, row.name, row.email, row.document);
  }

  async save(customer: Customer): Promise<void> {
    await this.prisma.customer.upsert({
      where: { id: customer.id },
      update: {
        name: customer.name,
        email: customer.email,
        document: customer.document,
      },
      create: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        document: customer.document,
      },
    });
  }
}
