import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Heart,
  MessageSquare,
  AlertTriangle,
  Shield,
  Star,
  TrendingUp,
  UserCheck,
  UserX,
  LogOut,
  Menu,
} from 'lucide-react';
import { getStats, logoutAdmin } from '../services/admin.api';

interface Stats {
  users: {
    total: number;
    verified: number;
    unverified: number;
    recent: number;
    online: number;
  };
  profiles: {
    total: number;
    real: number;
    fake: number;
    hetero: number;
    gay: number;
  };
  activity: {
    messages: number;
    likes: number;
    favorites: number;
    reports: number;
    blocks: number;
  };
  subscriptions: {
    active: number;
  };
  mostReportedProfiles: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports' | 'users'>('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold text-white">
                Panel de Administración
              </h1>
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

      {/* Navigation */}
      <nav className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-3 font-medium transition ${
                currentView === 'dashboard'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/reports')}
              className="px-4 py-3 font-medium text-gray-400 hover:text-white transition"
            >
              Denuncias
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="px-4 py-3 font-medium text-gray-400 hover:text-white transition"
            >
              Usuarios
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{stats?.users.total}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Usuarios</h3>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <UserCheck className="w-4 h-4 text-green-500" />
              <span className="text-gray-400">{stats?.users.verified} verificados</span>
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">{stats?.users.online}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Usuarios Online</h3>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-gray-400">{stats?.users.recent} nuevos (7 días)</span>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">{stats?.activity.messages}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Mensajes</h3>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-gray-400">{stats?.activity.likes} likes</span>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-white">{stats?.activity.reports}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Denuncias</h3>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-gray-400">{stats?.activity.blocks} bloqueos</span>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profiles Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Estadísticas de Perfiles</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Perfiles Reales</span>
                <span className="text-white font-semibold">{stats?.profiles.real}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Perfiles Falsos</span>
                <span className="text-white font-semibold">{stats?.profiles.fake}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Orientación Hetero</span>
                <span className="text-white font-semibold">{stats?.profiles.hetero}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Orientación Gay</span>
                <span className="text-white font-semibold">{stats?.profiles.gay}</span>
              </div>
            </div>
          </div>

          {/* Subscription Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Suscripciones</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Suscripciones Activas (9Plus)</span>
                <span className="text-white font-semibold">{stats?.subscriptions.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Favoritos Guardados</span>
                <span className="text-white font-semibold">{stats?.activity.favorites}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Most Reported Profiles */}
        {stats?.mostReportedProfiles && stats.mostReportedProfiles.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4">
              Perfiles Más Reportados
            </h3>
            <div className="space-y-3">
              {stats.mostReportedProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {profile.photos[0] && (
                      <img
                        src={profile.photos[0].url}
                        alt={profile.title}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{profile.title}</p>
                      <p className="text-gray-400 text-sm">{profile.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-white font-semibold">
                      {profile._count.reportsReceived} denuncias
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

