import { useState, useEffect, useRef } from 'react'
import { X, Search, UserCheck, UserX } from 'lucide-react'
import { supabase } from '../services/supabase'
import { TaskAttachments } from './TaskAttachments'

const PRIORITIES = [
  { value: 'low',    label: 'Baixa',  color: 'bg-green-500/20 text-green-400' },
  { value: 'medium', label: 'Média',  color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'high',   label: 'Alta',   color: 'bg-red-500/20 text-red-400' },
]

export function TaskModal({ task, columns, defaultColumnId, onSave, onClose }) {
  const [form, setForm] = useState({
    title:          task?.title       || '',
    description:    task?.description || '',
    priority:       task?.priority    || 'medium',
    due_date:       task?.due_date    || '',
    column_id:      task?.column_id   || defaultColumnId || columns[0]?.id || '',
    assigned_to:    task?.assigned_to    || null,
    assigned_email: task?.assigned_email || '',
  })

  const [userSearch, setUserSearch]       = useState(task?.assigned_email || '')
  const [userResults, setUserResults]     = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [assignedUser, setAssignedUser]   = useState(
    task?.assigned_profile || (task?.assigned_email ? { email: task.assigned_email } : null)
  )
  const searchTimeout = useRef(null)

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  useEffect(() => {
    if (!userSearch || userSearch.length < 3 || assignedUser) {
      setUserResults([])
      return
    }
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url')
          .ilike('email', `%${userSearch}%`)
          .limit(5)
        setUserResults(data || [])
      } finally {
        setSearchLoading(false)
      }
    }, 400)
    return () => clearTimeout(searchTimeout.current)
  }, [userSearch, assignedUser])

  const selectUser = (u) => {
    setAssignedUser(u)
    setForm(prev => ({ ...prev, assigned_to: u.id, assigned_email: u.email }))
    setUserSearch(u.email)
    setUserResults([])
  }

  const clearAssigned = () => {
    setAssignedUser(null)
    setUserSearch('')
    setForm(prev => ({ ...prev, assigned_to: null, assigned_email: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-white font-semibold text-lg">
            {task ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {/* Título */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Título *</label>
              <input
                autoFocus
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Nome da tarefa..."
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Detalhes da tarefa..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Coluna + Prioridade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Coluna</label>
                <select
                  value={form.column_id}
                  onChange={e => set('column_id', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Prioridade</label>
                <div className="flex gap-1">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => set('priority', p.value)}
                      className={`flex-1 text-xs py-2 rounded-lg font-medium transition-colors
                        ${form.priority === p.value ? p.color + ' ring-1 ring-current' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Data */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Data de vencimento</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => set('due_date', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Vincular responsável
                <span className="ml-1 text-gray-600 font-normal">(notificação por email)</span>
              </label>

              {assignedUser ? (
                <div className="flex items-center gap-3 bg-gray-800 border border-indigo-500/50 rounded-lg px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(assignedUser.full_name || assignedUser.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    {assignedUser.full_name && <p className="text-sm text-white font-medium truncate">{assignedUser.full_name}</p>}
                    <p className="text-xs text-gray-400 truncate">{assignedUser.email}</p>
                  </div>
                  <button type="button" onClick={clearAssigned} className="text-gray-500 hover:text-red-400 transition-colors">
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 gap-2 focus-within:border-indigo-500 transition-colors">
                    <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <input
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Buscar por email do usuário..."
                      className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    />
                    {searchLoading && <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />}
                  </div>

                  {userResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                      {userResults.map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => selectUser(u)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(u.full_name || u.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            {u.full_name && <p className="text-sm text-white font-medium truncate">{u.full_name}</p>}
                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                          </div>
                          <UserCheck className="w-4 h-4 text-indigo-400 ml-auto flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {userSearch.length >= 3 && !searchLoading && userResults.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1.5 px-1">Nenhum usuário encontrado.</p>
                  )}
                </div>
              )}
            </div>

            {/* Anexos — só aparece ao editar tarefa existente */}
            {task?.id && (
              <div className="border-t border-gray-800 pt-4">
                <TaskAttachments taskId={task.id} />
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors">
                {task ? 'Salvar alterações' : 'Criar tarefa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}