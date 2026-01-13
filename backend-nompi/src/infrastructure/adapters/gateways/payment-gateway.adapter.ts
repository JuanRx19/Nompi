import { PaymentDto } from 'src/application/dto/payment.dto';
import { IPaymentGateway } from '../../../domain/ports/gateways/payment-gateway.port';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { NompiTransactionResponseDto } from 'src/application/dto/nompi-transaction-response.dto';
import { PaymentLinkDto } from 'src/application/dto/payment-link.dto';

type NompiPaymentLinkResponse = {
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
      this.httpService.post<NompiPaymentLinkResponse>(url, payment_detail, {
        headers,
      }),
    );

    const paymentData = new PaymentDto();
    paymentData.redirect_url = `${process.env.NOMPI_CHECKOUT_BASE_URL}/l/${response.data.data.id}`;

    return paymentData;
  }

  async getTransaction(
    id: string,
  ): Promise<NompiTransactionResponseDto | null> {
    const url = `${process.env.NOMPI_API_BASE_URL}/transactions/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
    };

    const response = await firstValueFrom(
      this.httpService.get<NompiTransactionResponseDto>(url, { headers }),
    );

    return response.data;
  }

  async getProductReference(id: string): Promise<PaymentLinkDto | null> {
    const url = `${process.env.NOMPI_API_BASE_URL}/payment_links/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
    };

    const response = await firstValueFrom(
      this.httpService.get<PaymentLinkDto>(url, { headers }),
    );

    const { data } = response.data;
    Logger.log('Product reference data:', JSON.stringify(data));
    const paymentLinkData = new PaymentLinkDto();
    paymentLinkData.data.sku = data.sku;
    Logger.log('Payment link SKU:', paymentLinkData.data.sku);
    return paymentLinkData;
  }
}
