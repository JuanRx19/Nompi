import { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import type { Product } from '../types/product.types';
import PaymentModal from '../components/PaymentModal';
import SummaryBackdrop from '../components/SummaryBackdrop';
import { productsService } from '../api/services/products.service';
import { reloadPage } from '../utils/browser';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await productsService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleValidateCard = async (cardNumber: string) => {
    try {
      const cleanNumber = cardNumber.replace(/\D/g, '');

      const patterns = {
          visa: /^4/,
          mastercard: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/
      };

      if (patterns.visa.test(cleanNumber)) return "Visa";
      if (patterns.mastercard.test(cleanNumber)) return "Mastercard";
      
      return "Unknown";
    } catch (err) {
      console.error('Error al validar la tarjeta:', err);
      return "Unknown";
    }
  };

  const handleOpenShopModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={reloadPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="w-full max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    src="https://colombiafintech.co/wp-content/uploads/2025/05/Wompi_LogoPrincipal-scaled.jpg"
                    alt="nompi"
                    className="h-20 w-auto"
                  />
                </div>
                
                
              </div>
            </div>
          </header>
    
          {/* Productos */}
          <main className="w-full">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Productos
              </h2>
            </div>
    
            <div className="w-full pb-16">
              <ProductGrid
                products={products}
                onOpenShopModal={handleOpenShopModal}
                loading={loading}
                emptyMessage="No hay productos disponibles en este momento"
              />
            </div>
          </main>
          <PaymentModal
            isOpen={modalOpen}
            product={selectedProduct}
            validateCard={handleValidateCard}
            onClose={() => setModalOpen(false)}
          />
          <SummaryBackdrop />
      </div>
  );
};
