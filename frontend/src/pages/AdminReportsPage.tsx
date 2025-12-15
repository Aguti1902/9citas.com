import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Shield,
  LogOut,
  Trash2,
  User,
  Check,
  X,
} from 'lucide-react';
import { getAllReports, deleteReport, deleteUser, logoutAdmin } from '../services/admin.api';

interface Report {
  id: string;
  reason: string;
  createdAt: string;
  reporterProfile: {
    id: string;
    title: string;
    photos: Array<{ url: string }>;
    user: { email: string };
  };
  reportedProfile: {
    id: string;
    title: string;
    photos: Array<{ url: string }>;
    user: { id: string; email: string };
    _count: { reportsReceived: number };
  };
}

const REASON_LABELS: Record<string, string> = {
  scam: 'Estafa / Spam',
  inappropriate_photos: 'Fotos Inapropiadas',
  money_request: 'Solicitud de Dinero',
  fake_photos: 'Fotos Falsas',
  underage: 'Menor de Edad',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getAllReports();
      setReports(data.reports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('¿Descartar esta denuncia?')) return;

    setActionLoading(reportId);
    try {
      await deleteReport(reportId);
      setReports(reports.filter((r) => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Error al eliminar la denuncia');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, reportId: string) => {
    if (!confirm('¿ELIMINAR este usuario y todos sus datos? Esta acción es irreversible.')) return;

    setActionLoading(reportId);
    try {
      await deleteUser(userId);
      // Eliminar todos los reportes del usuario eliminado
      setReports(reports.filter((r) => r.reportedProfile.user.id !== userId));
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
        <div className="text-white text-xl">Cargando denuncias...</div>
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
              className="px-4 py-3 font-medium text-purple-400 border-b-2 border-purple-400"
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Denuncias ({reports.length})
          </h2>
        </div>

        {reports.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay denuncias pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Reported User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {report.reportedProfile.photos[0] && (
                        <img
                          src={report.reportedProfile.photos[0].url}
                          alt={report.reportedProfile.title}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {report.reportedProfile.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {report.reportedProfile.user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-red-400 text-sm">
                            {report.reportedProfile._count.reportsReceived} denuncias totales
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Report Details */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                          {REASON_LABELS[report.reason] || report.reason}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Denunciado por: <span className="text-white">{report.reporterProfile.title}</span>
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(report.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDeleteUser(report.reportedProfile.user.id, report.id)}
                      disabled={actionLoading === report.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <User className="w-4 h-4" />
                      Eliminar Usuario
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      disabled={actionLoading === report.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      Descartar Denuncia
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

