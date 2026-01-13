import { fireEvent, render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const createPaymentLink = jest.fn();
const redirectTo = jest.fn();

jest.mock('../../api/services/nompi.service', () => ({
  nompiService: {
    createPaymentLink: (...args: any[]) => createPaymentLink(...args),
  },
}));

jest.mock('../../utils/browser', () => ({
  redirectTo: (...args: any[]) => redirectTo(...args),
}));

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deshabilita botones cuando stock=0', () => {
    render(
      <ProductCard
        product={{ id: '1', name: 'P', description: 'D', price: 10, stock: 0, deleted: false }}
        onOpenShopModal={() => {}}
      />,
    );

    expect(screen.getByText('Comprar')).toBeDisabled();
    expect(screen.getByText('Link de pago')).toBeDisabled();
    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });

  it('muestra badge de low stock y dispara onOpenShopModal', () => {
    const onOpenShopModal = jest.fn();
    render(
      <ProductCard
        product={{ id: '1', name: 'P', description: 'D', price: 10, stock: 3, deleted: false }}
        onOpenShopModal={onOpenShopModal}
      />,
    );
    expect(screen.getByText('Solo 3 disponibles')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Comprar'));
    expect(onOpenShopModal).toHaveBeenCalled();
  });

  it('crea link de pago y hace redirect', async () => {
    createPaymentLink.mockResolvedValue({ redirect_url: 'http://pay.test' });

    render(
      <ProductCard
        product={{ id: '1', name: 'P', description: 'D', price: 10, stock: 10, deleted: false }}
      />,
    );

    fireEvent.click(screen.getByText('Link de pago'));

    // esperar microtask
    await Promise.resolve();
    expect(createPaymentLink).toHaveBeenCalled();
    expect(redirectTo).toHaveBeenCalledWith('http://pay.test');
  });
});
