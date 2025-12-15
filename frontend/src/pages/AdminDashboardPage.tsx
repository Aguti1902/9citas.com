import { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Target,
  Activity,
  Zap,
  DollarSign,
  UserPlus,
  Crown,
  Mail,
} from 'lucide-react';
import { getStats } from '../services/admin.api';
import AdminHeader from '../components/admin/AdminHeader';
import AdminNav from '../components/admin/AdminNav';

interface Stats {
  users: {
    total: number;
    verified: number;
    unverified: number;
    online: number;
    activeLast24h: number;
    newLast7days: number;
    newLast30days: number;
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
    messagesLast24h: number;
    likes: number;
    likesLast24h: number;
    matches: number;
    favorites: number;
    reports: number;
    blocks: number;
    activeConversations: number;
    avgMessagesPerUser: string;
  };
  subscriptions: {
    active: number;
    conversionRate: string;
  };
  conversion: {
    emailVerificationRate: string;
    profileCompletionRate: string;
  };
  registrationsByDay: { date: string; count: number }[];
  mostReportedProfiles: any[];
  mostActiveUsers: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    
    // Recargar estadísticas cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl font-bold">
            <span className="text-white">9</span>
            <span className="text-purple-500">CITAS</span>
          </div>
          <div className="text-white text-xl">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <AdminHeader />
      <AdminNav />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Última actualización */}
        <div className="mb-6 text-right">
          <span className="text-sm text-gray-400">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </span>
          <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.users.total}</span>
            </div>
            <h3 className="text-gray-300 font-semibold mb-2">Total Usuarios</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Verificados</span>
                <span className="text-green-400 font-semibold">{stats?.users.verified}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Nuevos (7d)</span>
                <span className="text-blue-400 font-semibold">+{stats?.users.newLast7days}</span>
              </div>
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.users.online}</span>
            </div>
            <h3 className="text-gray-300 font-semibold mb-2">Usuarios Online</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Activos (24h)</span>
                <span className="text-green-400 font-semibold">{stats?.users.activeLast24h}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(stats?.users.online / stats?.users.total * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-gray-400">
                  {((stats?.users.online / stats?.users.total * 100) || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Messages & Engagement */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.activity.messages.toLocaleString()}</span>
            </div>
            <h3 className="text-gray-300 font-semibold mb-2">Total Mensajes</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Últimas 24h</span>
                <span className="text-purple-400 font-semibold">+{stats?.activity.messagesLast24h}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Promedio/Usuario</span>
                <span className="text-purple-400 font-semibold">{stats?.activity.avgMessagesPerUser}</span>
              </div>
            </div>
          </div>

          {/* Matches */}
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.activity.matches}</span>
            </div>
            <h3 className="text-gray-300 font-semibold mb-2">Matches</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Likes (24h)</span>
                <span className="text-pink-400 font-semibold">+{stats?.activity.likesLast24h}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Total Likes</span>
                <span className="text-pink-400 font-semibold">{stats?.activity.likes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Secundarias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Suscripciones */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h3 className="text-gray-300 font-semibold">9Plus Activos</h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats?.subscriptions.active}</div>
            <div className="text-xs text-gray-400">
              Tasa de conversión: <span className="text-yellow-500 font-semibold">{stats?.subscriptions.conversionRate}%</span>
            </div>
          </div>

          {/* Conversaciones */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-indigo-500" />
              <h3 className="text-gray-300 font-semibold">Conversaciones</h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats?.activity.activeConversations}</div>
            <div className="text-xs text-gray-400">Activas en 7 días</div>
          </div>

          {/* Email Verification */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-cyan-500" />
              <h3 className="text-gray-300 font-semibold">Verificación</h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats?.conversion.emailVerificationRate}%</div>
            <div className="text-xs text-gray-400">Tasa de verificación</div>
          </div>

          {/* Denuncias */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-gray-300 font-semibold">Denuncias</h3>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats?.activity.reports}</div>
            <div className="text-xs text-gray-400">{stats?.activity.blocks} bloqueos totales</div>
          </div>
        </div>

        {/* Gráfico de Registros */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-white">Registros (Últimos 7 días)</h3>
            </div>
            <div className="text-sm text-gray-400">
              Total: <span className="text-white font-semibold">{stats?.users.newLast7days}</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {stats?.registrationsByDay.map((day, idx) => {
              const maxCount = Math.max(...(stats?.registrationsByDay.map(d => d.count) || [1]));
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-400 hover:to-blue-300"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0px' }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.count} registros
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profiles Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold text-white">Estadísticas de Perfiles</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Perfiles Reales</span>
                  <span className="text-white font-semibold">{stats?.profiles.real}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(stats?.profiles.real / stats?.profiles.total * 100) || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Perfiles Falsos</span>
                  <span className="text-white font-semibold">{stats?.profiles.fake}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full transition-all"
                    style={{ width: `${(stats?.profiles.fake / stats?.profiles.total * 100) || 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Orientación Hetero</span>
                  <span className="text-white font-semibold">{stats?.profiles.hetero}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">Orientación Gay</span>
                  <span className="text-white font-semibold">{stats?.profiles.gay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion & Engagement */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-white">Conversión & Engagement</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Verificación Email</span>
                  <span className="text-green-400 font-bold">{stats?.conversion.emailVerificationRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats?.conversion.emailVerificationRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Perfiles Completados</span>
                  <span className="text-blue-400 font-bold">{stats?.conversion.profileCompletionRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats?.conversion.profileCompletionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Favoritos Totales</span>
                  <span className="text-white font-semibold">{stats?.activity.favorites}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Conversión a 9Plus</span>
                  <span className="text-yellow-400 font-semibold">{stats?.subscriptions.conversionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usuarios Más Activos y Reportados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Active Users */}
          {stats?.mostActiveUsers && stats.mostActiveUsers.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-white">Usuarios Más Activos</h3>
              </div>
              <div className="space-y-3">
                {stats.mostActiveUsers.map((profile, idx) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full text-green-400 font-bold text-sm">
                      {idx + 1}
                    </div>
                    {profile.photos[0] && (
                      <img
                        src={profile.photos[0].url}
                        alt={profile.title}
                        className="w-12 h-12 rounded-full object-cover border-2 border-green-500/30"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">{profile.title}</p>
                      <p className="text-gray-400 text-xs">{profile.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {profile._count.sentMessages + profile._count.receivedMessages}
                      </div>
                      <div className="text-xs text-gray-400">mensajes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most Reported Profiles */}
          {stats?.mostReportedProfiles && stats.mostReportedProfiles.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold text-white">Perfiles Más Reportados</h3>
              </div>
              <div className="space-y-3">
                {stats.mostReportedProfiles.map((profile, idx) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full text-red-400 font-bold text-sm">
                      {idx + 1}
                    </div>
                    {profile.photos[0] && (
                      <img
                        src={profile.photos[0].url}
                        alt={profile.title}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500/30"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">{profile.title}</p>
                      <p className="text-gray-400 text-xs">{profile.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold">
                        {profile._count.reportsReceived}
                      </div>
                      <div className="text-xs text-gray-400">denuncias</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Google Analytics Info */}
        <div className="mt-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Google Analytics Integration
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                Para ver métricas detalladas de usuarios activos, páginas vistas, tiempo en sitio y más, 
                accede directamente a Google Analytics.
              </p>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
              >
                Abrir Google Analytics
                <TrendingUp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

