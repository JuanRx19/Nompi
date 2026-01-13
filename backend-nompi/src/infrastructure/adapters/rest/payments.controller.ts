import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GetPaymentUrlUseCase } from '../../../application/use-cases/payment/get-payment-url.usecase';
import { PaymentDto } from 'src/application/dto/payment.dto';
import { GetPaymentStatusUseCase } from 'src/application/use-cases/payment/get-payment-status-usecase';
import {
  SimulatePaymentDto,
  type SimulatePaymentResponseDto,
} from 'src/application/dto/simulate-payment.dto';
import { TransactionService } from 'src/application/services/transaction.service';
import {
  ProductRepositoryToken,
  type IProductRepository,
} from 'src/domain/ports/repositories/product.repository';
import {
  IdGeneratorToken,
  type IIdGenerator,
} from 'src/application/services/id-generator.service';
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly getPaymentUrl: GetPaymentUrlUseCase,
    private readonly getPaymentStatus: GetPaymentStatusUseCase,
    private readonly transactionService: TransactionService,
    @Inject(ProductRepositoryToken)
    private readonly productRepository: IProductRepository,
    @Inject(IdGeneratorToken)
    private readonly idGenerator: IIdGenerator,
  ) {}

  @Post()
  async create(@Body() payment_data: PaymentDto) {
    const url = await this.getPaymentUrl.execute(payment_data);
    return url;
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    const transaction = await this.getPaymentStatus.execute(id);
    return transaction;
  }

  @Post('simulate')
  async simulatePayment(
    @Body() dto: SimulatePaymentDto,
  ): Promise<SimulatePaymentResponseDto> {
    const rawCard = dto.cardNumber.replace(/\D/g, '');
    const approved = rawCard === '4242424242424242';

    if (!approved) {
      return { status: 'DECLINED' };
    }

    const product = await this.productRepository.findById(dto.productSku);
    if (!product) {
      throw new NotFoundException(`Producto no encontrado: ${dto.productSku}`);
    }

    const externalTransactionId = this.idGenerator.generate();

    const params = {
      externalTransactionId,
      amountInCents: product.price * 100,
      productSku: dto.productSku,
      merchant: {
        name: dto.customerName,
        email: dto.customerEmail,
        legal_id: dto.customerDocument,
      },
      idTransaction: externalTransactionId,
      baseFee: dto.baseFee,
      deliveryFee: dto.deliveryFee,
      delivery: {
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
      },
    };

    await this.transactionService.onApprovedNompiTransaction(params);

    return { status: 'APPROVED', transactionId: externalTransactionId };
  }
}
