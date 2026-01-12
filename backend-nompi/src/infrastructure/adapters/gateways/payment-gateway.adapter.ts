import { PaymentDto } from 'src/application/dto/payment.dto';
import { IPaymentGateway } from '../../../domain/ports/gateways/payment-gateway.port';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type WompiPaymentLinkResponse = {
  data: {
    id: string;
  };
};

@Injectable()
export class PaymentGateway implements IPaymentGateway {
  constructor(private readonly httpService: HttpService) {}

  async getNompiUrl(payment_detail: PaymentDto): Promise<PaymentDto | null> {
    const url = `${process.env.NOMPI_API_BASE_URL}/payment_links`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
    };

    const response = await firstValueFrom(
      this.httpService.post<WompiPaymentLinkResponse>(url, payment_detail, {
        headers,
      }),
    );

    const paymentData = new PaymentDto();
    paymentData.redirect_url = `${process.env.NOMPI_CHECKOUT_BASE_URL}/l/${response.data.data.id}`;

    return paymentData;
  }
}
