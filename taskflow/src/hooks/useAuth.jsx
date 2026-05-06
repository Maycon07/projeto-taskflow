// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react'
import { getSession, onAuthStateChange } from '../services/auth'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão inicial
    getSession().then((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de auth
    const unsubscribe = onAuthStateChange((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
