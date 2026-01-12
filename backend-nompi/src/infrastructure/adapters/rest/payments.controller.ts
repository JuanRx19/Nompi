import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GetPaymentUrlUseCase } from '../../../application/use-cases/payment/get-payment-url.usecase';
import { PaymentDto } from 'src/application/dto/payment.dto';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly getPaymentUrl: GetPaymentUrlUseCase) {}

  @Post()
  async create(@Body() payment_data: PaymentDto) {
    Logger.log('Received payment data:', JSON.stringify(payment_data));
    const url = await this.getPaymentUrl.execute(payment_data);
    return url;
  }
}
