import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SummaryBackdrop from './SummaryBackdrop';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const simulatePayment = jest.fn();

jest.mock('../app/store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      checkout: {
        step: 3,
        selectedProduct: { id: 'p1', name: 'P', description: 'D', price: 10000, stock: 1, deleted: false },
        cardInfo: { cardNumber: '4242424242424242', expiry: '12/34', cvc: '123' },
        deliveryInfo: { name: 'A', email: 'a@a.com', document: 12345, address: 'x', city: 'y', phone: '300' },
      },
    }),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock('../api/services/nompi.service', () => ({
  nompiService: {
    simulatePayment: (...args: any[]) => simulatePayment(...args),
  },
}));

describe('SummaryBackdrop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('checkoutState', 'x');
  });

  it('paga y navega a success', async () => {
    simulatePayment.mockResolvedValue('success');

    render(<SummaryBackdrop />);
    expect(screen.getByText('Resumen')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Pagar'));

    await waitFor(() => expect(simulatePayment).toHaveBeenCalled());
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/checkout/success'),
    );
  });

  it('cierra y limpia el estado persistido', () => {
    render(<SummaryBackdrop />);
    fireEvent.click(screen.getByText('✕'));
    expect(window.localStorage.getItem('checkoutState')).toBeNull();
  });
});
