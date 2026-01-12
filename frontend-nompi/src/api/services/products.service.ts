import type { Product } from '../../types/product.types';
import { apiGet } from '../api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`Falta configurar ${name} en el .env`);
  return value;
};

export const productsService = {
  async getAll(): Promise<Product[]> {
    const baseUrl = requireEnv('VITE_API_BASE_URL', API_BASE_URL);
    return apiGet<Product[]>(`${baseUrl}/products`);
  },
};
