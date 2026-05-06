// src/components/Header.jsx
import { Layers, LogOut, User } from 'lucide-react'

export default function Header({ user, onSignOut }) {
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="bg-white border-b border-surface-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-surface-900 text-lg tracking-tight">TaskFlow</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-surface-700 hidden sm:block">{name}</span>
          </div>
          <button
            onClick={onSignOut}
            className="btn-ghost rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
