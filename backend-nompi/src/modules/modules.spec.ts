import { CustomersModule } from './customers.module';
import { PaymentsModule } from './payments.module';
import { PrismaModule } from './prisma.module';
import { ProductsModule } from './products.module';
import { TransactionsModule } from './transactions.module';

describe('Modules smoke', () => {
  it('exporta módulos sin reventar', () => {
    expect(CustomersModule).toBeDefined();
    expect(PaymentsModule).toBeDefined();
    expect(PrismaModule).toBeDefined();
    expect(ProductsModule).toBeDefined();
    expect(TransactionsModule).toBeDefined();
  });
});
