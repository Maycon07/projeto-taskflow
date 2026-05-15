import { useState } from 'react'
import { X } from 'lucide-react'

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'
]

export function AddColumnModal({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('#6366f1')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), color })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Nova coluna</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome da coluna *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Em Revisão, Bloqueado..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5
                text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? '#ffffff' : 'transparent'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{ backgroundColor: color + '22', color: color, borderLeft: `3px solid ${color}` }}
          >
            {title || 'Nome da coluna'}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              Criar coluna
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}