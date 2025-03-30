import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  CreditCard, 
  BarChart3, 
  ShoppingCart,
  LogOut,
  PieChart,
  MessageSquareQuote,
  CreditCard as CardIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch session data when component is mounted
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error('Failed to fetch session');
        setSession(data.session);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Show loading screen if session is not ready
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Redirect to login if there is no session
  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Painel Admin</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {/* Dashboard link */}
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname === "/admin/dashboard" ? "bg-gray-200" : ""}`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Produtos link */}
            <li>
              <Link
                to="/admin/produtos"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname.includes("/admin/produtos") || location.pathname.includes("/admin/produto/") ? "bg-gray-200" : ""}`}
              >
                <Package className="w-5 h-5 mr-3" />
                <span>Produtos</span>
              </Link>
            </li>

            {/* Pedidos link */}
            <li>
              <Link
                to="/admin/pedidos"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname === "/admin/pedidos" ? "bg-gray-200" : ""}`}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                <span>Pedidos</span>
              </Link>
            </li>

            {/* Cartões Capturados link */}
            <li>
              <Link
                to="/admin/cartoes-capturados"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname === "/admin/cartoes-capturados" ? "bg-gray-200" : ""}`}
              >
                <CardIcon className="w-5 h-5 mr-3" />
                <span>Cartões Capturados</span>
              </Link>
            </li>

            {/* Configuração de PIX link */}
            <li>
              <Link
                to="/admin/pix-config/1"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname.includes("/admin/pix-config") ? "bg-gray-200" : ""}`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Configuração de PIX</span>
              </Link>
            </li>

            {/* Pixels e Analytics link */}
            <li>
              <Link
                to="/admin/pixels/1"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname.includes("/admin/pixels") ? "bg-gray-200" : ""}`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>Pixels e Analytics</span>
              </Link>
            </li>

            {/* Relatórios link */}
            <li>
              <Link
                to="/admin/relatorio"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname === "/admin/relatorio" ? "bg-gray-200" : ""}`}
              >
                <PieChart className="w-5 h-5 mr-3" />
                <span>Relatórios</span>
              </Link>
            </li>

            {/* Depoimentos link */}
            <li>
              <Link
                to="/admin/testimonials"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname === "/admin/testimonials" ? "bg-gray-200" : ""}`}
              >
                <MessageSquareQuote className="w-5 h-5 mr-3" />
                <span>Depoimentos</span>
              </Link>
            </li>

{/* Configurações link */}
<li>
  <Link
    to="/admin/global-config"
    className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${location.pathname.includes("/admin/global-config") ? "bg-gray-200" : ""}`}
  >
    <Settings className="w-5 h-5 mr-3" />
    <span>Configurações Globais</span>
  </Link>
</li>



            {/* Logout button */}
            <li>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center p-3 rounded-lg w-full hover:bg-red-100 hover:text-red-600 transition-colors justify-start"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Sair</span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
