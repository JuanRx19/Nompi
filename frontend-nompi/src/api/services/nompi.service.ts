import type { Payment } from '../../types/payment.types';
import type { Product } from '../../types/product.types';
import { apiPost, apiGet } from '../api';
import { getEnv } from '../env';

type NompiTransaction = {
  status?: string;
};

type SimulatePaymentResponse = {
  status: 'APPROVED' | 'DECLINED';
  transactionId?: string;
};

const getAppBaseUrl = (): string => {
  const envUrl = getEnv('VITE_FRONT_BASE_URL');
  return envUrl ?? window.location.origin;
};

const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`Falta configurar ${name} en el .env`);
  return value;
};

export const nompiService = {
  async createPaymentLink(product: Product): Promise<Payment> {
    const baseUrl = requireEnv('VITE_API_BASE_URL', API_BASE_URL);

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
      `${baseUrl}/payments`,
      payload,
    );

    return response;
  },

  async validateTransaction(id: string): Promise<'success' | 'failure'> {
    const baseUrl = requireEnv('VITE_API_BASE_URL', API_BASE_URL);
    const response = await apiGet<NompiTransaction>(
      `${baseUrl}/payments/${id}`,
    );
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
    const baseUrl = requireEnv('VITE_API_BASE_URL', API_BASE_URL);
    const response = await apiPost<SimulatePaymentResponse>(
      `${baseUrl}/payments/simulate`,
      payload,
    );

    return response.status === 'APPROVED' ? 'success' : 'failure';
  },
};
