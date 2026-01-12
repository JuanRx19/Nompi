import React from 'react';
import type { Product } from '../types/product.types';
import { ProductCard } from './ui/ProductCard';

interface ProductGridProps {
  products: Product[];
  onOpenShopModal?: (product: Product) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenShopModal,
  loading = false,
  emptyMessage = 'No hay productos disponibles',
}) => {

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <svg
          className="w-24 h-24 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-xl text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter((product) => !product.deleted)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenShopModal={onOpenShopModal}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
