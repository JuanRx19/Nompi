import { render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();
const validateTransaction = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock('../api/services/nompi.service', () => ({
  nompiService: {
    validateTransaction: (...args: any[]) => validateTransaction(...args),
  },
}));

describe('PurchaseShop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirige a failure si no hay id', async () => {
    window.history.pushState({}, '', '/checkout');
    const { default: PurchaseShop } = await import('./PurchaseShop');

    render(<PurchaseShop />);
    expect(screen.getByText('Validando tu compra…')).toBeInTheDocument();
    await Promise.resolve();

    expect(mockNavigate).toHaveBeenCalledWith('/checkout/failure', { replace: true });
  });

  it('valida transacción y navega a success', async () => {
    window.history.pushState({}, '', '/checkout?id=tx-1');
    validateTransaction.mockResolvedValue('success');

    const { default: PurchaseShop } = await import('./PurchaseShop');
    render(<PurchaseShop />);
    await Promise.resolve();

    expect(validateTransaction).toHaveBeenCalledWith('tx-1');
    expect(mockNavigate).toHaveBeenCalledWith('/checkout/success', { replace: true });
  });
});
