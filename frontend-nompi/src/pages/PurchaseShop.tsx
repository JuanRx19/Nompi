import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { nompiService } from '../api/services/nompi.service';

export const PurchaseShop: React.FC = () => {
  const navigate = useNavigate();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const validateTransaction = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get('id');
      if (!transactionId) {
        navigate('/checkout/failure', { replace: true });
        return;
      }

      const result = await nompiService.validateTransaction(transactionId);
      navigate(result === 'success' ? '/checkout/success' : '/checkout/failure', {
        replace: true,
      });
    };

    validateTransaction();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 p-8">
        <h1 className="text-xl font-semibold text-gray-900">Validando tu compra…</h1>
        <p className="mt-2 text-sm text-gray-600">Estamos verificando el estado de la transacción.</p>
      </div>
    </div>
  );
};

export default PurchaseShop;
