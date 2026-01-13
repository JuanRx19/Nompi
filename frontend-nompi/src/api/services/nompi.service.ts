import type { Payment } from '../../types/payment.types';
import type { Product } from '../../types/product.types';
import { apiPost, apiGet } from '../api';

type NompiTransaction = {
  status?: string;
};

type SimulatePaymentResponse = {
  status: 'APPROVED' | 'DECLINED';
  transactionId?: string;
};

const getAppBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_FRONT_BASE_URL as string | undefined;
  return envUrl ?? window.location.origin;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const nompiService = {
  async createPaymentLink(product: Product): Promise<Payment> {

    const payload = {
      amount_in_cents: product.price * 100,
      currency: 'COP',
      redirect_url: `${getAppBaseUrl()}/checkout`,
      collect_shipping: true,
      name: product.name,
      sku: `${product.id}`,
      description: product.description,
      single_use: true,
    };

    const response = await apiPost<Payment>(
      `${API_BASE_URL}/payments`,
      payload,
    );

    return response;
  },

  async validateTransaction(id: string): Promise<'success' | 'failure'> {
    const response = await apiGet<NompiTransaction>(
      `${API_BASE_URL}/payments/${id}`,
    );
    console.log('Validation response data:', response);
    const status = response.status;
    return status === 'APPROVED' ? 'success' : 'failure';
  },

  async simulatePayment(payload: {
    productSku: string;
    cardNumber: string;
    customerName: string;
    customerEmail: string;
    customerDocument: string;
    address: string;
    city: string;
    phone: string;
    baseFee?: number;
    deliveryFee?: number;
  }): Promise<'success' | 'failure'> {
    const response = await apiPost<SimulatePaymentResponse>(
      `${API_BASE_URL}/payments/simulate`,
      payload,
    );

    return response.status === 'APPROVED' ? 'success' : 'failure';
  },
};
