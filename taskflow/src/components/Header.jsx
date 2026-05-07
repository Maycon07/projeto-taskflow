// src/components/Header.jsx
import { Layers, LogOut } from 'lucide-react'

export default function Header({ user, onSignOut }) {
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="bg-surface-900 border-b border-surface-800 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/50">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-brand-800">
              {initials}
            </div>
            <span className="text-sm font-medium text-surface-300 hidden sm:block">{name}</span>
          </div>
          <button
            onClick={onSignOut}
            className="btn-ghost rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-950"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}