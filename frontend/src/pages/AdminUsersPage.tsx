import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  LogOut,
  Users,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  MessageSquare,
  Heart,
} from 'lucide-react';
import { getAllProfiles, deleteUser, logoutAdmin } from '../services/admin.api';

interface Profile {
  id: string;
  title: string;
  orientation: string;
  gender: string;
  age: number;
  city: string;
  isFake: boolean;
  isVerified: boolean;
  isOnline: boolean;
  createdAt: string;
  photos: Array<{ url: string; type: string }>;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  } | null;
  _count: {
    sentMessages: number;
    receivedMessages: number;
    sentLikes: number;
    receivedLikes: number;
    reportsReceived: number;
  };
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'real' | 'fake'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, filterType, profiles]);

  const loadProfiles = async () => {
    try {
      const data = await getAllProfiles();
      setProfiles(data.profiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = [...profiles];

    // Filter by type
    if (filterType === 'real') {
      filtered = filtered.filter((p) => !p.isFake);
    } else if (filterType === 'fake') {
      filtered = filtered.filter((p) => p.isFake);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.user?.email.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term)
      );
    }

    setFilteredProfiles(filtered);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿ELIMINAR este usuario y todos sus datos? Esta acción es irreversible.')) return;

    setActionLoading(userId);
    try {
      await deleteUser(userId);
      setProfiles(profiles.filter((p) => p.user?.id !== userId));
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando usuarios...</div>
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
              <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
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
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-3 font-medium text-gray-400 hover:text-white transition"
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
              className="px-4 py-3 font-medium text-purple-400 border-b-2 border-purple-400"
            >
              Usuarios
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email o ciudad..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Todos ({profiles.length})
              </button>
              <button
                onClick={() => setFilterType('real')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === 'real'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Reales ({profiles.filter((p) => !p.isFake).length})
              </button>
              <button
                onClick={() => setFilterType('fake')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === 'fake'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Falsos ({profiles.filter((p) => p.isFake).length})
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-start gap-4">
                {/* Profile Photo */}
                {profile.photos.find((p) => p.type === 'cover') && (
                  <img
                    src={profile.photos.find((p) => p.type === 'cover')!.url}
                    alt={profile.title}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-lg">{profile.title}</h3>
                    {profile.isFake && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        Falso
                      </span>
                    )}
                    {profile.isVerified && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                    {profile.isOnline && (
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    )}
                  </div>

                  {profile.user && (
                    <div className="space-y-1 mb-3">
                      <p className="text-gray-400 text-sm">{profile.user.email}</p>
                      <p className="text-gray-500 text-xs">
                        Registrado: {new Date(profile.user.createdAt).toLocaleDateString('es-ES')}
                        {profile.user.emailVerified ? (
                          <span className="text-green-500 ml-2">✓ Verificado</span>
                        ) : (
                          <span className="text-red-500 ml-2">✗ Sin verificar</span>
                        )}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      {profile.age} años • {profile.city}
                    </span>
                    <span className="text-gray-400">
                      {profile.orientation === 'hetero' ? '👫' : '🏳️‍🌈'} {profile.orientation}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{profile._count.sentMessages + profile._count.receivedMessages} mensajes</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>{profile._count.sentLikes + profile._count.receivedLikes} likes</span>
                    </div>
                    {profile._count.reportsReceived > 0 && (
                      <div className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>{profile._count.reportsReceived} denuncias</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {profile.user && (
                  <button
                    onClick={() => handleDeleteUser(profile.user!.id)}
                    disabled={actionLoading === profile.user.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredProfiles.length === 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

