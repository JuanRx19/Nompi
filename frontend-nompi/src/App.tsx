import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import PurchaseShop from './pages/PurchaseShop';
import PurchaseFailurePage from './pages/PurchaseFailurePage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/checkout" element={<PurchaseShop />} />
      <Route path="/checkout/success" element={<PurchaseSuccessPage />} />
      <Route path="/checkout/failure" element={<PurchaseFailurePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

