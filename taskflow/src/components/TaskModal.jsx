// src/components/TaskModal.jsx
import { useState, useEffect } from 'react'
import { X, Loader2, Trash2 } from 'lucide-react'

const STATUS_OPTS = [
  { value: 'todo',        label: '⬜ A Fazer'      },
  { value: 'in_progress', label: '🔵 Em Andamento' },
  { value: 'done',        label: '✅ Concluído'    },
]

const PRIORITY_OPTS = [
  { value: 'low',    label: '🟢 Baixa'  },
  { value: 'medium', label: '🟡 Média'  },
  { value: 'high',   label: '🔴 Alta'   },
]

export default function TaskModal({ task, defaultStatus, onSave, onDelete, onClose }) {
  const isEdit = !!task
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus || 'todo',
    priority: 'medium',
    due_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
      })
    }
  }, [task])

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try { await onSave(form) } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setLoading(true)
    try { await onDelete(task.id) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800">
          <h3 className="font-semibold text-surface-100 text-lg">
            {isEdit ? 'Editar tarefa' : 'Nova tarefa'}
          </h3>
          <button onClick={onClose} className="btn-ghost rounded-lg text-surface-500 hover:text-surface-200 p-1.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Título */}
          <div>
            <label className="label">Título <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ex: Revisar documentação da API"
              className="input"
              autoFocus
              maxLength={120}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="label">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Detalhes da tarefa (opcional)"
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Status + Prioridade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="input">
                {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Prioridade</label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)}
                className="input">
                {PRIORITY_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Data de vencimento */}
          <div>
            <label className="label">Data de vencimento</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => set('due_date', e.target.value)}
              className="input"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className={`btn-danger rounded-xl transition-all ${confirmDelete ? '!bg-red-700 !text-white !border-red-600' : ''}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {confirmDelete ? 'Confirmar exclusão' : 'Excluir'}
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-secondary rounded-xl">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !form.title.trim()}
                className="btn-primary rounded-xl"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                  : isEdit ? 'Salvar alterações' : 'Criar tarefa'
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}