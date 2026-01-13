import { fireEvent, render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock('../app/store', () => ({
  useAppDispatch: () => mockDispatch,
}));

describe('PurchaseSuccessPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispara reset en mount y vuelve al inicio', async () => {
    const { default: PurchaseSuccessPage } = await import('./PurchaseSuccessPage');
    render(<PurchaseSuccessPage />);
    expect(mockDispatch).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Volver al inicio'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
