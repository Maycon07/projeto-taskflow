import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Calendar, AlertCircle, Paperclip } from 'lucide-react'
import { format, isPast, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { getAttachments } from '../services/attachments'

const PRIORITY_STYLES = {
  low:    { dot: 'bg-green-500',  badge: 'text-green-400 bg-green-500/10',  label: 'Baixa'  },
  medium: { dot: 'bg-yellow-500', badge: 'text-yellow-400 bg-yellow-500/10', label: 'Média' },
  high:   { dot: 'bg-red-500',    badge: 'text-red-400 bg-red-500/10',      label: 'Alta'   },
}

export function TaskCard({ task, onEdit, onDelete, isDragging }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging: isSortableDragging,
  } = useSortable({ id: task.id, data: { columnId: task.column_id } })

  const [attachmentCount, setAttachmentCount] = useState(0)

  useEffect(() => {
    if (task.id) {
      getAttachments(task.id).then(a => setAttachmentCount(a?.length || 0)).catch(() => {})
    }
  }, [task.id])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  }

  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
  const isOverdue = task.due_date && isPast(parseISO(task.due_date))
  const assignedProfile = task.assigned_profile

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-800 border rounded-xl p-3 cursor-grab active:cursor-grabbing group
        select-none transition-shadow
        ${isDragging ? 'shadow-2xl scale-105' : 'shadow-sm hover:shadow-md'}
        ${isOverdue ? 'border-red-500/40' : 'border-gray-700 hover:border-gray-600'}`}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priority.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onEdit?.() }}
            className="p-1 text-gray-500 hover:text-indigo-400 rounded hover:bg-gray-700 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete?.() }}
            className="p-1 text-gray-500 hover:text-red-400 rounded hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Título */}
      <p className="text-white text-sm font-medium leading-snug mb-2">{task.title}</p>

      {/* Descrição */}
      {task.description && (
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          {/* Data */}
          {task.due_date && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
              {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              {format(parseISO(task.due_date), 'dd MMM', { locale: ptBR })}
            </div>
          )}

          {/* Anexos */}
          {attachmentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Paperclip className="w-3 h-3" />
              {attachmentCount}
            </div>
          )}
        </div>

        {/* Avatar responsável */}
        {(assignedProfile || task.assigned_email) && (
          <div
            className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center
              text-white text-xs font-bold flex-shrink-0 ring-2 ring-gray-800"
            title={assignedProfile?.full_name || assignedProfile?.email || task.assigned_email}
          >
            {(assignedProfile?.full_name || assignedProfile?.email || task.assigned_email || '?')[0].toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}