import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/store';
import { resetCheckout } from '../features/checkout/checkoutSlice';

export const PurchaseSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetCheckout());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 border border-green-200">
            <svg
              className="h-6 w-6 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Compra exitosa</h1>
            <p className="text-sm text-gray-600">Tu pago fue procesado correctamente.</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-700">
            Gracias por tu compra. En breve recibirás la confirmación.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 w-full px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
