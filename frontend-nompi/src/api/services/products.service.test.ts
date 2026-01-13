describe('productsService', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.VITE_API_BASE_URL;
  });

  it('falla si falta VITE_API_BASE_URL', async () => {
    const { productsService } = await import('./products.service');
    await expect(productsService.getAll()).rejects.toThrow('Falta configurar VITE_API_BASE_URL');
  });

  it('llama apiGet con /products', async () => {
    process.env.VITE_API_BASE_URL = 'http://api.test';

    const apiGet = jest.fn().mockResolvedValue([{ id: '1' }]);
    jest.doMock('../api', () => ({ apiGet }));

    const { productsService } = await import('./products.service');
    const result = await productsService.getAll();

    expect(apiGet).toHaveBeenCalledWith('http://api.test/products');
    expect(result).toEqual([{ id: '1' }]);
  });
});
