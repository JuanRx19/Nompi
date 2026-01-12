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

const loadInitialState = (): CheckoutState => {
  if (typeof window === 'undefined') {
    return {
      selectedProduct: null,
      cardInfo: null,
      deliveryInfo: null,
      step: 0,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        selectedProduct: null,
        cardInfo: null,
        deliveryInfo: null,
        step: 0,
      };
    }

    const parsed = JSON.parse(raw) as CheckoutState;

    const deliveryInfoRaw = (parsed as unknown as { deliveryInfo?: unknown })
      .deliveryInfo as
      | {
          name?: unknown;
          email?: unknown;
          document?: unknown;
          address?: unknown;
          city?: unknown;
          phone?: unknown;
          fullName?: unknown;
        }
      | null
      | undefined;

    const deliveryInfo: DeliveryInfo | null = deliveryInfoRaw
      ? {
          name:
            typeof deliveryInfoRaw.name === 'string'
              ? deliveryInfoRaw.name
              : typeof deliveryInfoRaw.fullName === 'string'
                ? deliveryInfoRaw.fullName
                : '',
          email: typeof deliveryInfoRaw.email === 'string' ? deliveryInfoRaw.email : '',
          document:
            typeof deliveryInfoRaw.document === 'number'
              ? deliveryInfoRaw.document
              : typeof deliveryInfoRaw.document === 'string'
                ? Number.parseInt(deliveryInfoRaw.document, 10) || 0
                : 0,
          address:
            typeof deliveryInfoRaw.address === 'string' ? deliveryInfoRaw.address : '',
          city: typeof deliveryInfoRaw.city === 'string' ? deliveryInfoRaw.city : '',
          phone: typeof deliveryInfoRaw.phone === 'string' ? deliveryInfoRaw.phone : '',
        }
      : null;

    return {
      // No reanudar modales/pasos automáticamente al recargar.
      // Conservamos solo la info del formulario para precargar inputs.
      selectedProduct: null,
      cardInfo: parsed.cardInfo ?? null,
      deliveryInfo,
      step: 0,
    };
  } catch {
    return {
      selectedProduct: null,
      cardInfo: null,
      deliveryInfo: null,
      step: 0,
    };
  }
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
