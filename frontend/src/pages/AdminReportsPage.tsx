import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  User,
  Check,
  X,
} from 'lucide-react';
import { getAllReports, deleteReport, deleteUser } from '../services/admin.api';
import AdminHeader from '../components/admin/AdminHeader';
import AdminNav from '../components/admin/AdminNav';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando denuncias...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <AdminNav />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20">
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

