import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma.module';
import { PaymentsModule } from './modules/payments.module';
import { ProductsModule } from './modules/products.module';
import { CustomersModule } from './modules/customers.module';
import { TransactionsModule } from './modules/transactions.module';

@Module({
  imports: [
    PrismaModule,
    PaymentsModule,
    ProductsModule,
    CustomersModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
