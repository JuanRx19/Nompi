import type { Payment } from '../../types/payment.types';
import type { Product } from '../../types/product.types';
import { apiPost, apiGet } from '../api';

type NompiEnvelope<T> = { data: T };

type NompiTransaction = {
  status?: string;
};

const NOMPI_API_BASE_URL = import.meta.env.VITE_NOMPI_API_BASE_URL;

const getAppBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_FRONT_BASE_URL as string | undefined;
  return envUrl ?? window.location.origin;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const nompiService = {
  async createPaymentLink(product: Product): Promise<Payment> {

    const payload = {
      amount_in_cents: product.price,
      currency: 'COP',
      redirect_url: `${getAppBaseUrl()}/checkout`,
      collect_shipping: true,
      name: product.name,
      reference: `product-${product.id}`,
      description: product.description,
      single_use: true,
    };

    console.log('Payment link payload:', payload);

    const response = await apiPost<Payment>(
      `${API_BASE_URL}/payments`,
      payload,
    );

    return response;
  },

  async validateTransaction(id: string): Promise<'success' | 'failure'> {
    const response = await apiGet<NompiEnvelope<NompiTransaction>>(
      `${NOMPI_API_BASE_URL}/transactions/${id}`,
    );

    const status = response.data?.status;
    return status === 'APPROVED' ? 'success' : 'failure';
  },
};
