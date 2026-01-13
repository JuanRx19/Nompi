import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const getAll = jest.fn();
const reloadPage = jest.fn();

jest.mock('../utils/browser', () => ({
  reloadPage: (...args: any[]) => reloadPage(...args),
}));

jest.mock('../api/services/products.service', () => ({
  productsService: {
    getAll: (...args: any[]) => getAll(...args),
  },
}));

jest.mock('../components/ProductGrid', () => ({
  ProductGrid: ({ products, onOpenShopModal, loading, emptyMessage }: any) => (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="count">{products.length}</div>
      <div>{emptyMessage}</div>
      <button onClick={() => onOpenShopModal?.(products[0])}>open</button>
    </div>
  ),
}));

jest.mock('../components/SummaryBackdrop', () => () => <div data-testid="summary" />);

jest.mock('../components/PaymentModal', () => ({
  __esModule: true,
  default: ({ isOpen, product, validateCard }: any) => (
    <div>
      <div data-testid="modal-open">{String(isOpen)}</div>
      <div data-testid="modal-product">{product?.name ?? ''}</div>
      <button
        onClick={async () => {
          const t = await validateCard?.('4242424242424242');
          (window as any).__cardType = t;
        }}
      >
        validate-visa
      </button>
      <button
        onClick={async () => {
          const t = await validateCard?.('5555555555554444');
          (window as any).__cardType = t;
        }}
      >
        validate-mc
      </button>
    </div>
  ),
}));

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).__cardType = undefined;
  });

  it('carga productos y abre modal con el producto seleccionado', async () => {
    getAll.mockResolvedValue([
      { id: '1', name: 'P1', description: 'D', price: 1, stock: 1, deleted: false },
    ]);

    const { ProductsPage } = await import('./ProductsPage');
    render(<ProductsPage />);

    await waitFor(() => expect(getAll).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'));

    fireEvent.click(screen.getByText('open'));
    expect(screen.getByTestId('modal-open').textContent).toBe('true');
    expect(screen.getByTestId('modal-product').textContent).toBe('P1');

    fireEvent.click(screen.getByText('validate-visa'));
    await Promise.resolve();
    expect((window as any).__cardType).toBe('Visa');

    fireEvent.click(screen.getByText('validate-mc'));
    await Promise.resolve();
    expect((window as any).__cardType).toBe('Mastercard');
  });

  it('muestra pantalla de error si falla la carga', async () => {
    getAll.mockRejectedValue(new Error('boom'));

    const { ProductsPage } = await import('./ProductsPage');
    render(<ProductsPage />);

    await waitFor(() => expect(getAll).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
    expect(screen.getByText('boom')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Intentar de nuevo'));
    expect(reloadPage).toHaveBeenCalled();
  });
});
