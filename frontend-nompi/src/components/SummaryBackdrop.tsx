import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import {
  persistCheckoutState,
  resetCheckout,
  setStep,
} from '../features/checkout/checkoutSlice';

const DELIVERY_FEE = 5000;

export const SummaryBackdrop: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct, step } = useAppSelector((state) => state.checkout);

  if (step !== 3 || !selectedProduct) return null;

  const baseFee = selectedProduct.price;
  const total = baseFee + DELIVERY_FEE;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClose = () => {
    dispatch(setStep(0));
  };

  const handlePay = () => {
    // Aquí luego se integrará el pago real (Paso 4)
    console.log('Pagar producto', selectedProduct.id);
    dispatch(resetCheckout());

    persistCheckoutState({
      selectedProduct: null,
      cardInfo: null,
      deliveryInfo: null,
      step: 0,
    });

    // Por ahora simulamos éxito. Cuando se integre el pago real,
    // redirige a /checkout/failure si falla.
    navigate('/checkout/success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Resumen</h2>
            <p className="text-sm text-gray-600">Paso 3 – Verifica la información antes de pagar.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Producto</span>
            <span className="text-sm font-medium text-gray-900">
              {selectedProduct.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Base fee</span>
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(baseFee)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Delivery fee</span>
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(DELIVERY_FEE)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePay}
          className="w-full mt-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm"
        >
          Pagar
        </button>
      </div>
    </div>
  );
};

export default SummaryBackdrop;
