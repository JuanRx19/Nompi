import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import {
  clearPersistedCheckoutState,
  resetCheckout,
} from '../features/checkout/checkoutSlice';
import { nompiService } from '../api/services/nompi.service';

const DELIVERY_FEE = 5000;

const baseFee = 2000;

export const SummaryBackdrop: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct, step, cardInfo, deliveryInfo } = useAppSelector(
    (state) => state.checkout,
  );

  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (step !== 3 || !selectedProduct) return null;

  const amount = selectedProduct.price;
  const total = amount + baseFee + DELIVERY_FEE;

  const canPay = Boolean(selectedProduct && cardInfo && deliveryInfo) && !isPaying;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClose = () => {
    dispatch(resetCheckout());
    clearPersistedCheckoutState();
  };

  const handlePay = () => {
    const run = async () => {
      if (!selectedProduct || !cardInfo || !deliveryInfo) return;

      setIsPaying(true);
      setError(null);

      try {
        const result = await nompiService.simulatePayment({
          productSku: selectedProduct.id,
          cardNumber: cardInfo.cardNumber,
          customerName: deliveryInfo.name,
          customerEmail: deliveryInfo.email,
          customerDocument: String(deliveryInfo.document),
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          phone: deliveryInfo.phone,
          baseFee,
          deliveryFee: DELIVERY_FEE,
        });

        dispatch(resetCheckout());
        clearPersistedCheckoutState();

        navigate(result === 'success' ? '/checkout/success' : '/checkout/failure');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error procesando el pago');
      } finally {
        setIsPaying(false);
      }
    };

    run();
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
            <span className="text-sm text-gray-600">Amount fee</span>
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(amount)}
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
          disabled={!canPay}
          className={
            "w-full mt-2 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-sm " +
            (canPay ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed')
          }
        >
          {isPaying ? 'Procesando…' : 'Pagar'}
        </button>

        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default SummaryBackdrop;
