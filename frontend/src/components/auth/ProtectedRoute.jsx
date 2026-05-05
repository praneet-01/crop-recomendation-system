import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!user?.is_staff) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Outlet />
  return <Navigate to={user?.is_staff ? '/admin' : '/dashboard'} replace />
}
