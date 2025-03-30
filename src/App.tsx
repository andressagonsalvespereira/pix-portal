import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';

// Páginas públicas
import Index from './pages/Index';
import Login from './pages/Login';
import CheckoutPage from './pages/CheckoutPage';
import CartaoPage from './pages/CartaoPage';
import PixPage from './pages/PixPage';
import PixAsaasPage from './pages/PixAsaasPage';
import PaymentFailedPage from './pages/PaymentFailedPage';

// Layout admin e páginas
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminProduto from './pages/admin/AdminProduto';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminCapturedCards from './pages/admin/AdminCapturedCards';
import AdminPixConfig from './pages/admin/AdminPixConfig';
import AdminPixUnified from './pages/admin/AdminPixUnified';
import AdminPixels from './pages/admin/AdminPixels';
import AdminConfig from './pages/admin/AdminConfig';
import AdminCheckoutConfig from './pages/admin/AdminCheckoutConfig';
import AdminCheckoutCustomization from './pages/admin/AdminCheckoutCustomization';
import AdminGlobalConfig from './pages/admin/AdminGlobalConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>

          {/* Home route */}
          <Route path="/" element={<Index />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />

          {/* Public checkout routes */}
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
          <Route path="/checkout/:slug/pix" element={<PixPage />} />
          <Route path="/checkout/:slug/pix-asaas" element={<PixAsaasPage />} />
          <Route path="/checkout/:slug/payment-failed/:pedidoId?" element={<PaymentFailedPage />} />

          {/* Rota fora do fluxo de checkout, se quiser acessar direto */}
          <Route path="/pix-asaas" element={<PixAsaasPage />} />

          {/* Admin Routes - protegidas */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/pedidos" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="produto/:id" element={<AdminProduto />} />
            <Route path="produto/new" element={<AdminProduto />} />
            <Route path="relatorio" element={<AdminRelatorio />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="cartoes-capturados" element={<AdminCapturedCards />} />
            <Route path="pix-config/:id" element={<AdminPixConfig />} />
            <Route path="pix-unified/:id" element={<AdminPixUnified />} />
            <Route path="pixels/:id" element={<AdminPixels />} />
            <Route path="config/:id" element={<AdminConfig />} />
            <Route path="checkout-config/:id" element={<AdminCheckoutConfig />} />
            <Route path="checkout-customization/:id" element={<AdminCheckoutCustomization />} />
            <Route path="global-config" element={<AdminGlobalConfig />} />
          </Route>

        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
