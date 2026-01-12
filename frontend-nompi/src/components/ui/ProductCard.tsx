import React from 'react';
import type { Product } from '../../types/product.types';
import { nompiService } from '../../api/services/nompi.service';

interface ProductCardProps {
  product: Product;
  onOpenShopModal?: (product: Product) => void;
  validateShop?: (id: string) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onOpenShopModal,
}) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const handlePaymentLink = async () => {
    
    try {
      const productForPayment = {
        ...product,
        price: product.price * 100,
      };
      
      const { redirect_url } = await nompiService.createPaymentLink(productForPayment);
      window.location.assign(redirect_url);
    }
    catch (error) {
      console.error('Error creating payment link:', error);
    }
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Imagen del producto */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badge de stock */}
        {isOutOfStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Agotado
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Solo {product.stock} disponibles
          </div>
        )}
      </div>

      {/* Contenido del card */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Nombre del producto */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Precio y stock */}
        <div className="mt-auto">
          {/* Precio */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Indicador de stock disponible */}
          {!isOutOfStock && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  isLowStock ? 'bg-orange-500' : 'bg-green-500'
                }`}
              />
              <span
                className={
                  isLowStock ? 'text-orange-700' : 'text-green-700'
                }
              >
                {product.stock} en stock
              </span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            {onOpenShopModal && (
              <button
                onClick={() => onOpenShopModal(product)}
                disabled={isOutOfStock}
                className={`flex-1 px-2 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                <span className="inline-block mr-2">🛒</span>
                Comprar
              </button>
            )}

            <button
                disabled={isOutOfStock}
                onClick={handlePaymentLink}
                className={`flex-1 px-2 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                Link de pago
              </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};