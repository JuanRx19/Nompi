import { fireEvent, render, screen } from '@testing-library/react';
import { PaymentModal } from './PaymentModal';

const mockDispatch = jest.fn();
const mockCheckoutState = {
  selectedProduct: null,
  cardInfo: null,
  deliveryInfo: null,
  step: 0,
};

jest.mock('../app/store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector({ checkout: mockCheckoutState }),
}));

describe('PaymentModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('no renderiza cuando isOpen=false', () => {
    render(
      <PaymentModal
        isOpen={false}
        product={{ id: '1', name: 'P', description: 'D', price: 10, stock: 1, deleted: false }}
        onClose={() => {}}
      />,
    );
    expect(screen.queryByText('Pago del producto')).toBeNull();
  });

  it('valida tarjeta con validateCard y permite continuar con datos válidos', async () => {
    const onClose = jest.fn();
    const validateCard = jest.fn().mockResolvedValue('Visa');

    render(
      <PaymentModal
        isOpen
        product={{ id: 'sku-1', name: 'Producto', description: 'Desc', price: 10, stock: 1, deleted: false }}
        validateCard={validateCard}
        onClose={onClose}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Documento'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('Dirección'), { target: { value: 'Calle 1' } });
    fireEvent.change(screen.getByPlaceholderText('Ciudad'), { target: { value: 'Bogotá' } });
    fireEvent.change(screen.getByPlaceholderText('Teléfono'), { target: { value: '3001234567' } });

    fireEvent.change(screen.getByPlaceholderText('Número de tarjeta'), { target: { value: '4242424242424242' } });
    expect(validateCard).toHaveBeenCalledWith('4242424242424242');
    expect(await screen.findByAltText('Visa')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('MM/AA'), { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('CVC'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Continuar'));

    expect(onClose).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();

    const raw = window.localStorage.getItem('checkoutState');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.cardInfo.cardNumber).toBe('4242');
  });
});
