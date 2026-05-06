// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  return user ? <Navigate to="/board" replace /> : children
}

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <p className="text-surface-500 text-sm font-medium">Carregando...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/board" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/board" element={<PrivateRoute><BoardPage /></PrivateRoute>} />
    </Routes>
  )
}
