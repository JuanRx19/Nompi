import reducer, {
  clearPersistedCheckoutState,
  persistCheckoutState,
  resetCheckout,
  setCardInfo,
  setDeliveryInfo,
  setSelectedProduct,
  setStep,
  type CheckoutState,
} from './checkoutSlice';

describe('checkoutSlice', () => {
  const baseState: CheckoutState = {
    selectedProduct: null,
    cardInfo: null,
    deliveryInfo: null,
    step: 0,
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('setSelectedProduct/setStep actualizan el estado', () => {
    const product = { id: 'p1', name: 'P', description: 'D', price: 10, stock: 1, deleted: false };
    let state = reducer(baseState, setSelectedProduct(product));
    state = reducer(state, setStep(2));
    expect(state.selectedProduct?.id).toBe('p1');
    expect(state.step).toBe(2);
  });

  it('setCardInfo/setDeliveryInfo y resetCheckout', () => {
    let state = reducer(baseState, setCardInfo({ cardNumber: '4242', expiry: '12/34', cvc: '123' }));
    state = reducer(state, setDeliveryInfo({
      name: 'A',
      email: 'a@a.com',
      document: 12345,
      address: 'x',
      city: 'y',
      phone: '300',
    }));
    expect(state.cardInfo?.expiry).toBe('12/34');
    expect(state.deliveryInfo?.document).toBe(12345);

    state = reducer(state, resetCheckout());
    expect(state).toEqual(baseState);
  });

  it('persistCheckoutState guarda tarjeta enmascarada y limpia con clearPersistedCheckoutState', () => {
    persistCheckoutState({
      selectedProduct: { id: 'p1', name: 'P', description: 'D', price: 10, stock: 1, deleted: false },
      cardInfo: { cardNumber: '4242424242424242', expiry: '12/34', cvc: '123' },
      deliveryInfo: { name: 'A', email: 'a@a.com', document: 12345, address: 'x', city: 'y', phone: '300' },
      step: 3,
    });

    const raw = window.localStorage.getItem('checkoutState');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.cardInfo.cardNumber).toBe('4242');
    expect(parsed.cardInfo.cvc).toBe('');

    clearPersistedCheckoutState();
    expect(window.localStorage.getItem('checkoutState')).toBeNull();
  });
});
