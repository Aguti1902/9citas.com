import { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Target,
  Activity,
  Zap,
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Logo oficial */}
          <div className="mb-4">
            <img 
              src="/logo4.png" 
              alt="9citas.com" 
              className="h-32 w-auto object-contain animate-pulse"
            />
          </div>
          {/* Texto de carga */}
          <div className="text-white text-2xl font-bold">Cargando estadísticas...</div>
          {/* Spinner */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#fc4d5c]/20 border-t-[#fc4d5c] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-[#00a3e8] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          {/* Indicador */}
          <div className="flex gap-2 mt-4">
            <div className="w-3 h-3 bg-[#fc4d5c] rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-[#00a3e8] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-[#01cc00] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <AdminNav />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-16">
        {/* Última actualización */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-3xl font-black text-white">
            📊 Dashboard
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#fc4d5c]/10 border border-[#fc4d5c]/30 rounded-lg">
            <span className="text-sm text-gray-300 font-medium">
              Última actualización: {new Date().toLocaleTimeString('es-ES')}
            </span>
            <span className="inline-block w-2.5 h-2.5 bg-[#01cc00] rounded-full animate-pulse shadow-lg shadow-[#01cc00]/50"></span>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-[#fc4d5c]/20 via-[#fc4d5c]/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-[#fc4d5c]/30 hover:border-[#fc4d5c]/50 hover:shadow-lg hover:shadow-[#fc4d5c]/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#fc4d5c]/30 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-4xl font-black text-white">{stats?.users.total}</span>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Total Usuarios</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Verificados</span>
                <span className="text-[#01cc00] font-bold">{stats?.users.verified}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Nuevos (7d)</span>
                <span className="text-[#fc4d5c] font-bold">+{stats?.users.newLast7days}</span>
              </div>
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-gradient-to-br from-[#01cc00]/20 via-[#01cc00]/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-[#01cc00]/30 hover:border-[#01cc00]/50 hover:shadow-lg hover:shadow-[#01cc00]/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#01cc00]/30 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-4xl font-black text-white">{stats?.users.online}</span>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Usuarios Online</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Activos (24h)</span>
                <span className="text-[#01cc00] font-bold">{stats?.users.activeLast24h}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#01cc00] to-[#01cc00]/70 h-2 rounded-full transition-all shadow-lg shadow-[#01cc00]/50"
                    style={{ width: `${((stats?.users.online || 0) / (stats?.users.total || 1) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[#01cc00] font-bold min-w-[45px]">
                  {(((stats?.users.online || 0) / (stats?.users.total || 1) * 100)).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Messages & Engagement */}
          <div className="bg-gradient-to-br from-[#00a3e8]/20 via-[#00a3e8]/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-[#00a3e8]/30 hover:border-[#00a3e8]/50 hover:shadow-lg hover:shadow-[#00a3e8]/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#00a3e8]/30 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-4xl font-black text-white">{stats?.activity.messages.toLocaleString()}</span>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Total Mensajes</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Últimas 24h</span>
                <span className="text-[#00a3e8] font-bold">+{stats?.activity.messagesLast24h}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Promedio/Usuario</span>
                <span className="text-[#00a3e8] font-bold">{stats?.activity.avgMessagesPerUser}</span>
              </div>
            </div>
          </div>

          {/* Matches */}
          <div className="bg-gradient-to-br from-[#fc4d5c]/20 via-[#fc4d5c]/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-[#fc4d5c]/30 hover:border-[#fc4d5c]/50 hover:shadow-lg hover:shadow-[#fc4d5c]/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#fc4d5c]/30 rounded-xl shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-4xl font-black text-white">{stats?.activity.matches}</span>
            </div>
            <h3 className="text-white font-bold mb-3 text-lg">Matches</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Likes (24h)</span>
                <span className="text-[#fc4d5c] font-bold">+{stats?.activity.likesLast24h}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Total Likes</span>
                <span className="text-[#fc4d5c] font-bold">{stats?.activity.likes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Secundarias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Suscripciones */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#ffcc00]/30 hover:border-[#ffcc00]/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-[#ffcc00]" />
              <h3 className="text-white font-bold">9Plus Activos</h3>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats?.subscriptions.active}</div>
            <div className="text-sm text-gray-300">
              Conversión: <span className="text-[#ffcc00] font-bold">{stats?.subscriptions.conversionRate}%</span>
            </div>
          </div>

          {/* Conversaciones */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#00a3e8]/30 hover:border-[#00a3e8]/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-[#00a3e8]" />
              <h3 className="text-white font-bold">Conversaciones</h3>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats?.activity.activeConversations}</div>
            <div className="text-sm text-gray-300">Activas en 7 días</div>
          </div>

          {/* Email Verification */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#01cc00]/30 hover:border-[#01cc00]/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-[#01cc00]" />
              <h3 className="text-white font-bold">Verificación</h3>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats?.conversion.emailVerificationRate}%</div>
            <div className="text-sm text-gray-300">Tasa de verificación</div>
          </div>

          {/* Denuncias */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#fc4d5c]/30 hover:border-[#fc4d5c]/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-[#fc4d5c]" />
              <h3 className="text-white font-bold">Denuncias</h3>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats?.activity.reports}</div>
            <div className="text-sm text-gray-300">{stats?.activity.blocks} bloqueos totales</div>
          </div>
        </div>

        {/* Gráfico de Registros */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#fc4d5c]/30 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserPlus className="w-7 h-7 text-[#fc4d5c]" />
              <h3 className="text-2xl font-black text-white">Registros (Últimos 7 días)</h3>
            </div>
            <div className="px-4 py-2 bg-[#fc4d5c]/20 border border-[#fc4d5c]/40 rounded-lg">
              <span className="text-sm text-gray-300">Total: </span>
              <span className="text-lg font-black text-[#fc4d5c]">{stats?.users.newLast7days}</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48 px-2">
            {stats?.registrationsByDay.map((day, idx) => {
              const maxCount = Math.max(...(stats?.registrationsByDay.map(d => d.count) || [1]));
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                  <div className="relative w-full group">
                    <div 
                      className="w-full bg-gradient-to-t from-[#fc4d5c] via-[#fc4d5c]/90 to-[#fc4d5c]/70 rounded-t-xl transition-all hover:from-[#fc4d5c] hover:to-[#fc4d5c] shadow-lg hover:shadow-[#fc4d5c]/50"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '12px' : '0px' }}
                    ></div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black border border-[#fc4d5c]/50 px-3 py-1.5 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-10">
                      <span className="font-bold text-[#fc4d5c]">{day.count}</span> registros
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 text-center font-medium uppercase">
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
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#fc4d5c]/30">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-7 h-7 text-[#fc4d5c]" />
              <h3 className="text-2xl font-black text-white">Estadísticas de Perfiles</h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300 font-semibold">Perfiles Reales</span>
                  <span className="text-white font-black text-lg">{stats?.profiles.real}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#01cc00] to-[#01cc00]/70 h-3 rounded-full transition-all shadow-lg shadow-[#01cc00]/50"
                    style={{ width: `${((stats?.profiles.real || 0) / (stats?.profiles.total || 1) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300 font-semibold">Perfiles Falsos</span>
                  <span className="text-white font-black text-lg">{stats?.profiles.fake}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-gray-600 to-gray-500 h-3 rounded-full transition-all"
                    style={{ width: `${((stats?.profiles.fake || 0) / (stats?.profiles.total || 1) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#fc4d5c]/20">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300 font-semibold">👫 Orientación Hetero</span>
                  <span className="text-[#fc4d5c] font-black text-lg">{stats?.profiles.hetero}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300 font-semibold">🏳️‍🌈 Orientación Gay</span>
                  <span className="text-[#fc4d5c] font-black text-lg">{stats?.profiles.gay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion & Engagement */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#01cc00]/30">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-7 h-7 text-[#01cc00]" />
              <h3 className="text-2xl font-black text-white">Conversión & Engagement</h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300 font-semibold">Verificación Email</span>
                  <span className="text-[#01cc00] font-black text-xl">{stats?.conversion.emailVerificationRate}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#01cc00] to-[#01cc00]/70 h-3 rounded-full transition-all shadow-lg shadow-[#01cc00]/50"
                    style={{ width: `${stats?.conversion.emailVerificationRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300 font-semibold">Perfiles Completados</span>
                  <span className="text-[#00a3e8] font-black text-xl">{stats?.conversion.profileCompletionRate}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#00a3e8] to-[#00a3e8]/70 h-3 rounded-full transition-all shadow-lg shadow-[#00a3e8]/50"
                    style={{ width: `${stats?.conversion.profileCompletionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#01cc00]/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Favoritos Totales</span>
                  <span className="text-[#fc4d5c] font-black text-lg">{stats?.activity.favorites}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Conversión a 9Plus</span>
                  <span className="text-[#ffcc00] font-black text-lg">{stats?.subscriptions.conversionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usuarios Más Activos y Reportados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Active Users */}
          {stats?.mostActiveUsers && stats.mostActiveUsers.length > 0 && (
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#01cc00]/30">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-7 h-7 text-[#01cc00]" />
                <h3 className="text-2xl font-black text-white">Top 5 Más Activos</h3>
              </div>
              <div className="space-y-3">
                {stats.mostActiveUsers.map((profile, idx) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-4 p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-all border border-[#01cc00]/20 hover:border-[#01cc00]/40"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#01cc00] to-[#01cc00]/70 rounded-full text-white font-black text-lg shadow-lg shadow-[#01cc00]/30">
                      {idx + 1}
                    </div>
                    {profile.photos[0] && (
                      <img
                        src={profile.photos[0].url}
                        alt={profile.title}
                        className="w-14 h-14 rounded-full object-cover border-3 border-[#01cc00]/50 shadow-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-bold text-base">{profile.title}</p>
                      <p className="text-gray-400 text-xs">{profile.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#01cc00] font-black text-xl">
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
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#fc4d5c]/30">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-7 h-7 text-[#fc4d5c]" />
                <h3 className="text-2xl font-black text-white">Top 5 Más Reportados</h3>
              </div>
              <div className="space-y-3">
                {stats.mostReportedProfiles.map((profile, idx) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-4 p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-all border border-[#fc4d5c]/20 hover:border-[#fc4d5c]/40"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#fc4d5c] to-[#fc4d5c]/70 rounded-full text-white font-black text-lg shadow-lg shadow-[#fc4d5c]/30">
                      {idx + 1}
                    </div>
                    {profile.photos[0] && (
                      <img
                        src={profile.photos[0].url}
                        alt={profile.title}
                        className="w-14 h-14 rounded-full object-cover border-3 border-[#fc4d5c]/50 shadow-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-bold text-base">{profile.title}</p>
                      <p className="text-gray-400 text-xs">{profile.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#fc4d5c] font-black text-xl">
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

      </main>
    </div>
  );
}

