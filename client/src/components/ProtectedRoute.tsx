import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  // Пока идёт проверка /api/auth/me
  if (loading) {
    return (
      <div className="text-white text-center py-20">
        Loading…
      </div>
    )
  }

  // Если не авторизован — редирект на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Иначе показываем дочерние компоненты
  return <>{children}</>
}
