import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, AlertTriangle, Users } from 'lucide-react';

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition relative ${
              isActive('/admin/dashboard')
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
            {isActive('/admin/dashboard') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
            )}
          </button>
          
          <button
            onClick={() => navigate('/admin/reports')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition relative ${
              isActive('/admin/reports')
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Denuncias
            {isActive('/admin/reports') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
            )}
          </button>
          
          <button
            onClick={() => navigate('/admin/users')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition relative ${
              isActive('/admin/users')
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuarios
            {isActive('/admin/users') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

