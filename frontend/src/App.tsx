import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import CookieBanner from './components/common/CookieBanner'

// Páginas
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateProfilePage from './pages/CreateProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import DashboardLayout from './components/layout/DashboardLayout'
import NavigatePage from './pages/NavigatePage'
import ProfileDetailPage from './pages/ProfileDetailPage'
import LikesPage from './pages/LikesPage'
import FavoritesPage from './pages/FavoritesPage'
import InboxPage from './pages/InboxPage'
import ChatPage from './pages/ChatPage'
import PlusPage from './pages/PlusPage'
import InfoPage from './pages/InfoPage'
import AdminPage from './pages/AdminPage'
import PrivatePhotoRequestsPage from './pages/PrivatePhotoRequestsPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import EmailSentPage from './pages/EmailSentPage'

function App() {
  const { isAuthenticated, hasProfile, initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <>
      <CookieBanner />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/app" /> : <IndexPage />} />
      <Route path="/login/:orientation" element={<LoginPage />} />
      <Route path="/register/:orientation" element={<RegisterPage />} />
      <Route path="/email-sent" element={<EmailSentPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

      {/* Ruta de crear perfil */}
      <Route
        path="/create-profile"
        element={
          isAuthenticated && !hasProfile ? (
            <CreateProfilePage />
          ) : isAuthenticated ? (
            <Navigate to="/app" />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Rutas protegidas (requieren autenticación y perfil) */}
      <Route
        path="/app"
        element={
          isAuthenticated && hasProfile ? (
            <DashboardLayout />
          ) : isAuthenticated ? (
            <Navigate to="/create-profile" />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route index element={<NavigatePage />} />
        <Route path="profile/:id" element={<ProfileDetailPage />} />
        <Route path="likes" element={<LikesPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="chat/:profileId" element={<ChatPage />} />
        <Route path="plus" element={<PlusPage />} />
        <Route path="info" element={<InfoPage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="private-photo-requests" element={<PrivatePhotoRequestsPage />} />
      </Route>

      {/* Ruta de admin (oculta) */}
      <Route path="/admin" element={<AdminPage />} />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App

