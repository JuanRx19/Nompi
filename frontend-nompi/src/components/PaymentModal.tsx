import React, { useState } from 'react';
import type { Product } from '../types/product.types';
import Input from './ui/Input';
import { useAppDispatch, useAppSelector } from '../app/store';
import {
  clearPersistedCheckoutState,
  resetCheckout,
  setCardInfo,
  setDeliveryInfo,
  setSelectedProduct,
  setStep,
  persistCheckoutState,
  type CheckoutState,
} from '../features/checkout/checkoutSlice';

interface PaymentModalProps {
  isOpen: boolean;
  product: Product | null;
  validateCard?: (cardNumber: string) => Promise<string>;
  onClose: () => void;
}

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

const luhnCheck = (digits: string) => {
  if (!/^\d+$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

type PaymentModalContentProps = {
  product: Product;
  checkout: CheckoutState;
  validateCard?: (cardNumber: string) => Promise<string>;
  onClose: () => void;
};

const PaymentModalContent: React.FC<PaymentModalContentProps> = ({
  product,
  checkout,
  validateCard,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    dispatch(resetCheckout());
    clearPersistedCheckoutState();
    onClose();
  };

  const [cardNumber, setCardNumber] = useState(() =>
    formatCardNumber(checkout.cardInfo?.cardNumber ?? ''),
  );
  const [expiry, setExpiry] = useState(() => checkout.cardInfo?.expiry ?? '');
  const [cvc, setCvc] = useState(() => checkout.cardInfo?.cvc ?? '');
  const [customerName, setCustomerName] = useState(
    () => checkout.deliveryInfo?.name ?? '',
  );
  const [customerEmail, setCustomerEmail] = useState(
    () => checkout.deliveryInfo?.email ?? '',
  );
  const [customerDocument, setCustomerDocument] = useState(() => {
    const doc = checkout.deliveryInfo?.document;
    return typeof doc === 'number' && doc > 0 ? String(doc) : '';
  });

  const [deliveryAddress, setDeliveryAddress] = useState(
    () => checkout.deliveryInfo?.address ?? '',
  );
  const [deliveryCity, setDeliveryCity] = useState(
    () => checkout.deliveryInfo?.city ?? '',
  );
  const [deliveryPhone, setDeliveryPhone] = useState(
    () => checkout.deliveryInfo?.phone ?? '',
  );

  const [cardType, setCardType] = useState<string>('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const rawCardNumber = cardNumber.replace(/\D/g, '');

  const errors = (() => {
    const next: Record<string, string> = {};

    if (!customerName.trim()) next.customerName = 'El nombre es obligatorio.';
    if (!customerEmail.trim()) next.customerEmail = 'El email es obligatorio.';
    else if (!isValidEmail(customerEmail))
      next.customerEmail = 'Ingresa un email válido.';

    const documentDigits = customerDocument.replace(/\D/g, '');
    if (!documentDigits) next.customerDocument = 'El documento es obligatorio.';
    else if (documentDigits.length < 5) next.customerDocument = 'Documento inválido.';

    if (!deliveryAddress.trim()) next.deliveryAddress = 'La dirección es obligatoria.';
    if (!deliveryCity.trim()) next.deliveryCity = 'La ciudad es obligatoria.';
    if (!deliveryPhone.trim()) next.deliveryPhone = 'El teléfono es obligatorio.';
    else if (!isValidPhone(deliveryPhone)) next.deliveryPhone = 'Teléfono inválido.';

    if (rawCardNumber.length !== 16)
      next.cardNumber = 'La tarjeta debe tener 16 dígitos.';
    else if (!luhnCheck(rawCardNumber))
      next.cardNumber = 'Número de tarjeta inválido.';

    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry))
      next.expiry = 'Formato inválido (MM/AA).';

    if (!/^\d{3,4}$/.test(cvc)) next.cvc = 'CVC inválido.';

    return next;
  })();

  const isFormValid = Object.keys(errors).length === 0;
  const isContinueDisabled = attemptedSubmit && !isFormValid;

  const handleCardNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(formatCardNumber(raw));

    if (!validateCard) return;

    try {
      const type = await validateCard(raw);
      setCardType(type);
    } catch {
      setCardType('');
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleContinue = () => {
    setAttemptedSubmit(true);
    if (!isFormValid) return;

    const document = Number.parseInt(customerDocument.replace(/\D/g, ''), 10);
    if (!document || Number.isNaN(document)) return;

    dispatch(setSelectedProduct(product));
    dispatch(
      setCardInfo({
        cardNumber: rawCardNumber,
        expiry,
        cvc,
      }),
    );
    dispatch(
      setDeliveryInfo({
        name: customerName.trim(),
        email: customerEmail.trim(),
        document,
        address: deliveryAddress.trim(),
        city: deliveryCity.trim(),
        phone: deliveryPhone.trim(),
      }),
    );
    dispatch(setStep(3));

    persistCheckoutState({
      selectedProduct: product,
      cardInfo: { cardNumber: rawCardNumber, expiry, cvc },
      deliveryInfo: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        document,
        address: deliveryAddress.trim(),
        city: deliveryCity.trim(),
        phone: deliveryPhone.trim(),
      },
      step: 3,
    });

    onClose();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Pago del producto
            </h2>
            <p className="text-sm text-gray-600">
              Paso 2 – Ingresa los datos de tu tarjeta y envío.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-1">
          <p className="text-sm font-medium text-gray-800">{product.name}</p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Datos del cliente
            </h3>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre completo"
              error={attemptedSubmit && Boolean(errors.customerName)}
              hint={attemptedSubmit ? errors.customerName : undefined}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email"
                error={attemptedSubmit && Boolean(errors.customerEmail)}
                hint={attemptedSubmit ? errors.customerEmail : undefined}
              />
              <Input
                type="tel"
                value={customerDocument}
                onChange={(e) =>
                  setCustomerDocument(e.target.value.replace(/\D/g, '').slice(0, 12))
                }
                placeholder="Documento"
                error={attemptedSubmit && Boolean(errors.customerDocument)}
                hint={attemptedSubmit ? errors.customerDocument : undefined}
              />
            </div>

            <div className="mt-4 space-y-4">
              <Input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Dirección"
                error={attemptedSubmit && Boolean(errors.deliveryAddress)}
                hint={attemptedSubmit ? errors.deliveryAddress : undefined}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder="Ciudad"
                  error={attemptedSubmit && Boolean(errors.deliveryCity)}
                  hint={attemptedSubmit ? errors.deliveryCity : undefined}
                />
                <Input
                  type="tel"
                  value={deliveryPhone}
                  onChange={(e) =>
                    setDeliveryPhone(e.target.value.replace(/\D/g, '').slice(0, 15))
                  }
                  placeholder="Teléfono"
                  error={attemptedSubmit && Boolean(errors.deliveryPhone)}
                  hint={attemptedSubmit ? errors.deliveryPhone : undefined}
                />
              </div>

              
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Datos de tarjeta
            </h3>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="relative">
                <Input
                  type="tel"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="Número de tarjeta"
                  className="pl-[62px]"
                  error={attemptedSubmit && Boolean(errors.cardNumber)}
                  hint={attemptedSubmit ? errors.cardNumber : undefined}
                />
                <span className="pointer-events-none absolute left-0 top-0 flex h-11 w-[46px] items-center justify-center border-r border-gray-200">
                  {cardType === 'Visa' ? (
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmf5rQoOt87qU25VDboIWw9KtxP0rfs6XSqw&s"
                      alt="Visa"
                      className="h-3 w-auto"
                    />
                  ) : (
                    <img
                      src="https://cdn.iconscout.com/icon/free/png-256/free-tarjeta-mastercard-logo-icon-svg-download-png-2944982.png"
                      alt="Mastercard"
                      className="h-4 w-auto"
                    />
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="tel"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  error={attemptedSubmit && Boolean(errors.expiry)}
                  hint={attemptedSubmit ? errors.expiry : undefined}
                />
                <Input
                  type="tel"
                  value={cvc}
                  onChange={handleCvcChange}
                  placeholder="CVC"
                  error={attemptedSubmit && Boolean(errors.cvc)}
                  hint={attemptedSubmit ? errors.cvc : undefined}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isContinueDisabled}
            className={
              "px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-sm " +
              (isContinueDisabled
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700")
            }
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  product,
  validateCard,
  onClose,
}) => {
  const checkout = useAppSelector((state) => state.checkout);

  if (!isOpen || !product) return null;

  return (
    <PaymentModalContent
      product={product}
      checkout={checkout}
      validateCard={validateCard}
      onClose={onClose}
    />
  );
};

export default PaymentModal;