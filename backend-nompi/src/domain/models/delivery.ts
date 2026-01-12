import { DeliveryStatus } from '../enums/deliveryStatusEnum';

export class Delivery {
  constructor(
    public readonly id: string,
    public readonly idTransaction: string,
    public readonly address: string,
    public readonly city: string,
    public readonly phone: string,
    public readonly status: DeliveryStatus,
  ) {}
}
