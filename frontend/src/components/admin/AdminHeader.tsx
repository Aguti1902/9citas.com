import { useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { logoutAdmin } from '../../services/admin.api';

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo 9CITAS */}
            <div className="flex items-center gap-2">
              <div className="text-4xl font-bold">
                <span className="text-white">9</span>
                <span className="text-purple-500">CITAS</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-600"></div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-semibold text-gray-300">
                Panel de Administración
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}

