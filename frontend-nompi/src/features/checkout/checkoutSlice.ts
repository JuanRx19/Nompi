import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product.types';

export interface CardInfo {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface DeliveryInfo {
  name: string;
  email: string;
  document: number;
  address: string;
  city: string;
  phone: string;
}

export interface CheckoutState {
  selectedProduct: Product | null;
  cardInfo: CardInfo | null;
  deliveryInfo: DeliveryInfo | null;
  step: number;
}

const STORAGE_KEY = 'checkoutState';

export const clearPersistedCheckoutState = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorar errores de almacenamiento
  }
};

const loadInitialState = (): CheckoutState => {
  if (typeof window === 'undefined') {
    return {
      selectedProduct: null,
      cardInfo: null,
      deliveryInfo: null,
      step: 0,
    };
  }

  // Por seguridad/UX: si el usuario recarga la página, no debe persistir
  // información sensible del checkout.
  clearPersistedCheckoutState();

  return {
    selectedProduct: null,
    cardInfo: null,
    deliveryInfo: null,
    step: 0,
  };

};

const initialState: CheckoutState = loadInitialState();

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload;
    },
    setCardInfo(state, action: PayloadAction<CardInfo | null>) {
      state.cardInfo = action.payload;
    },
    setDeliveryInfo(state, action: PayloadAction<DeliveryInfo | null>) {
      state.deliveryInfo = action.payload;
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    resetCheckout(state) {
      state.selectedProduct = null;
      state.cardInfo = null;
      state.deliveryInfo = null;
      state.step = 0;
    },
  },
});

export const { setSelectedProduct, setCardInfo, setDeliveryInfo, setStep, resetCheckout } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;

export const persistCheckoutState = (state: CheckoutState) => {
  if (typeof window === 'undefined') return;

  try {
    const safeState: CheckoutState = {
      ...state,
      cardInfo: state.cardInfo
        ? {
            cardNumber: state.cardInfo.cardNumber.slice(-4),
            expiry: state.cardInfo.expiry,
            cvc: '',
          }
        : null,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
  } catch {
    // ignorar errores de almacenamiento
  }
};
