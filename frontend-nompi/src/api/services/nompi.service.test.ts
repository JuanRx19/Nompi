describe('nompiService', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.VITE_API_BASE_URL;
    delete process.env.VITE_FRONT_BASE_URL;
  });

  it('falla si falta VITE_API_BASE_URL', async () => {
    const { nompiService } = await import('./nompi.service');
    // @ts-expect-error partial product
    await expect(nompiService.createPaymentLink({ id: '1', price: 10, name: 'P', description: 'D' })).rejects.toThrow(
      'Falta configurar VITE_API_BASE_URL',
    );
  });

  it('createPaymentLink usa redirect_url con VITE_FRONT_BASE_URL', async () => {
    process.env.VITE_API_BASE_URL = 'http://api.test';
    process.env.VITE_FRONT_BASE_URL = 'http://front.test';

    const apiPost = jest.fn().mockResolvedValue({ redirect_url: 'http://x' });
    jest.doMock('../api', () => ({ apiPost, apiGet: jest.fn() }));

    const { nompiService } = await import('./nompi.service');

    const product = {
      id: 'sku-1',
      name: 'Producto',
      description: 'Desc',
      price: 123,
      stock: 10,
      deleted: false,
    };

    await nompiService.createPaymentLink(product);

    expect(apiPost).toHaveBeenCalledWith(
      'http://api.test/payments',
      expect.objectContaining({
        amount_in_cents: 12300,
        redirect_url: 'http://front.test/checkout',
        sku: 'sku-1',
      }),
    );
  });

  it('validateTransaction retorna success cuando status APPROVED', async () => {
    process.env.VITE_API_BASE_URL = 'http://api.test';
    const apiGet = jest.fn().mockResolvedValue({ status: 'APPROVED' });
    jest.doMock('../api', () => ({ apiGet, apiPost: jest.fn() }));

    const { nompiService } = await import('./nompi.service');
    await expect(nompiService.validateTransaction('tx-1')).resolves.toBe('success');
    expect(apiGet).toHaveBeenCalledWith('http://api.test/payments/tx-1');
  });

  it('simulatePayment retorna failure cuando status DECLINED', async () => {
    process.env.VITE_API_BASE_URL = 'http://api.test';
    const apiPost = jest.fn().mockResolvedValue({ status: 'DECLINED' });
    jest.doMock('../api', () => ({ apiPost, apiGet: jest.fn() }));

    const { nompiService } = await import('./nompi.service');
    await expect(
      nompiService.simulatePayment({
        productSku: '1',
        cardNumber: '4242424242424242',
        customerName: 'A',
        customerEmail: 'a@a.com',
        customerDocument: '12345',
        address: 'x',
        city: 'y',
        phone: '3001234567',
      }),
    ).resolves.toBe('failure');
  });
});
