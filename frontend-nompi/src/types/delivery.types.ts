import { DeliveryStatus } from './delivery-status.types';

export interface Customer {
  id: string;
  idTransaction: string;
  address: string;
  city: string;
  phone: string;
  status: keyof typeof DeliveryStatus;
}