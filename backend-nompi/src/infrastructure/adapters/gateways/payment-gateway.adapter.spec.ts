import { of } from 'rxjs';
import type { HttpService } from '@nestjs/axios';
import { PaymentGateway } from './payment-gateway.adapter';
import { PaymentDto } from 'src/application/dto/payment.dto';

describe('PaymentGateway', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.NOMPI_API_BASE_URL = 'https://api.test';
    process.env.NOMPI_CHECKOUT_BASE_URL = 'https://checkout.test';
    process.env.WOMPI_PRIVATE_KEY = 'secret';
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('getNompiUrl construye redirect_url con el id del payment link', async () => {
    const httpService = {
      post: jest.fn().mockReturnValue(
        of({
          data: { data: { id: 'pl_1' } },
        }),
      ),
      get: jest.fn(),
    } as unknown as HttpService;

    const gateway = new PaymentGateway(httpService);

    const dto = new PaymentDto();
    const result = await gateway.getNompiUrl(dto);

    expect(httpService.post).toHaveBeenCalledTimes(1);
    expect(result?.redirect_url).toBe('https://checkout.test/l/pl_1');
  });

  it('getTransaction retorna response.data', async () => {
    const httpService = {
      post: jest.fn(),
      get: jest.fn().mockReturnValue(of({ data: { data: { id: 't1' } } })),
    } as unknown as HttpService;

    const gateway = new PaymentGateway(httpService);
    const result = await gateway.getTransaction('t1');

    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: { id: 't1' } });
  });

  it('getProductReference retorna PaymentLinkDto con sku', async () => {
    const httpService = {
      post: jest.fn(),
      get: jest.fn().mockReturnValue(
        of({
          data: { data: { sku: 'sku-1' } },
        }),
      ),
    } as unknown as HttpService;

    const gateway = new PaymentGateway(httpService);
    const result = await gateway.getProductReference('pl_1');

    expect(result?.data.sku).toBe('sku-1');
  });
});
