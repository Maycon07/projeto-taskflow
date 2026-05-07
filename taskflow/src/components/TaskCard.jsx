// src/components/TaskCard.jsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, GripVertical, CalendarDays, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const PRIORITY_CONFIG = {
  low:    { label: 'Baixa',  classes: 'bg-slate-800 text-slate-400 border border-slate-700',  dot: 'bg-slate-500' },
  medium: { label: 'Média',  classes: 'bg-amber-950 text-amber-400 border border-amber-900',  dot: 'bg-amber-500' },
  high:   { label: 'Alta',   classes: 'bg-red-950   text-red-400   border border-red-900',    dot: 'bg-red-500'   },
}

const STATUS_ICON = {
  todo:        <Clock        className="w-3.5 h-3.5 text-surface-500" />,
  in_progress: <AlertCircle  className="w-3.5 h-3.5 text-brand-400"  />,
  done:        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/>,
}

export default function TaskCard({ task, onEdit, onDelete, isDragging }) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.3 : 1,
  }

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

  const dueDateEl = task.due_date ? (() => {
    const d = new Date(task.due_date + 'T00:00:00')
    const overdue = isPast(d) && !isToday(d) && task.status !== 'done'
    const today = isToday(d)
    return (
      <span className={`flex items-center gap-1 text-xs font-medium
        ${overdue ? 'text-red-400' : today ? 'text-amber-400' : 'text-surface-500'}`}>
        <CalendarDays className="w-3 h-3" />
        {overdue ? '⚠ ' : today ? '• Hoje' : ''}
        {format(d, "d MMM", { locale: ptBR })}
      </span>
    )
  })() : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative card rounded-xl p-3.5 cursor-pointer select-none
        task-card-hover
        ${isDragging ? 'rotate-2 scale-105' : ''}
        ${isSortDragging ? 'opacity-30' : ''}
      `}
      onClick={onEdit}
    >
      {/* Left accent bar animada no hover */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:top-1 group-hover:bottom-1" />

      {/* Top row: drag + status + priority */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 text-surface-600 hover:text-surface-300 cursor-grab active:cursor-grabbing transition-all duration-150 mt-0.5"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          {STATUS_ICON[task.status]}
        </div>

        {/* Priority badge */}
        <span className={`badge ${priority.classes} flex-shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-500 hover:text-brand-400 hover:bg-brand-950 transition-all duration-150"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-950 transition-all duration-150"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-surface-100 leading-snug line-clamp-2 mb-1.5 pl-5 group-hover:text-white transition-colors duration-150">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-surface-500 line-clamp-2 mb-2.5 pl-5 group-hover:text-surface-400 transition-colors duration-150">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-5 mt-1">
        {dueDateEl || <span />}
        <div
          className="w-6 h-6 rounded-full bg-brand-800 ring-1 ring-brand-700 flex items-center justify-center text-brand-300 text-[10px] font-bold group-hover:ring-brand-500 transition-all duration-150"
          title={task.owner_name || task.owner_email}
        >
          {(task.owner_name || task.owner_email || '?')[0].toUpperCase()}
        </div>
      </div>

      {/* Done overlay */}
      {task.status === 'done' && (
        <div className="absolute inset-0 rounded-xl bg-emerald-950/10 pointer-events-none" />
      )}
    </div>
  )
}