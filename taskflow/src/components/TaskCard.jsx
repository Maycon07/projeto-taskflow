// src/components/TaskCard.jsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, GripVertical, CalendarDays, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const PRIORITY_CONFIG = {
  low:    { label: 'Baixa',  classes: 'bg-slate-100 text-slate-500' },
  medium: { label: 'Média',  classes: 'bg-amber-50 text-amber-600'  },
  high:   { label: 'Alta',   classes: 'bg-red-50 text-red-600'      },
}

const STATUS_ICON = {
  todo:        <Clock        className="w-3.5 h-3.5 text-surface-400" />,
  in_progress: <AlertCircle  className="w-3.5 h-3.5 text-brand-500"  />,
  done:        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>,
}

export default function TaskCard({ task, onEdit, onDelete, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
  }

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

  const dueDateEl = task.due_date ? (() => {
    const d = new Date(task.due_date + 'T00:00:00')
    const overdue = isPast(d) && !isToday(d) && task.status !== 'done'
    const today = isToday(d)
    return (
      <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500 font-medium' : today ? 'text-amber-500 font-medium' : 'text-surface-400'}`}>
        <CalendarDays className="w-3 h-3" />
        {overdue ? 'Atrasada · ' : today ? 'Hoje · ' : ''}
        {format(d, "d MMM", { locale: ptBR })}
      </span>
    )
  })() : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group card rounded-xl p-3.5 cursor-pointer hover:shadow-card-hover transition-all duration-200 select-none
        ${isDragging ? 'rotate-2 scale-105 shadow-2xl' : ''}
      `}
      onClick={onEdit}
    >
      {/* Drag handle + Actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 text-surface-300 hover:text-surface-500 cursor-grab active:cursor-grabbing mt-0.5 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {STATUS_ICON[task.status]}
            <span className={`badge ${priority.classes}`}>{priority.label}</span>
          </div>
          <h4 className="text-sm font-semibold text-surface-900 leading-snug line-clamp-2">
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-surface-500 line-clamp-2 mb-2 pl-6">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-6">
        {dueDateEl || <span />}
        <div
          className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold"
          title={task.owner_name || task.owner_email}
        >
          {(task.owner_name || task.owner_email || '?')[0].toUpperCase()}
        </div>
      </div>
    </div>
  )
}
