// src/components/KanbanColumn.jsx
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'

const COLUMN_STYLES = {
  todo: {
    dot:    'bg-surface-400',
    badge:  'bg-surface-800 text-surface-400',
    border: 'border-surface-700',
    bg:     'bg-surface-900',
    addBtn: 'border-surface-700 hover:border-surface-500 hover:text-surface-300',
    glow:   'shadow-surface-800/20',
  },
  in_progress: {
    dot:    'bg-brand-500',
    badge:  'bg-brand-950 text-brand-400',
    border: 'border-brand-900',
    bg:     'bg-surface-900',
    addBtn: 'border-brand-900 hover:border-brand-700 hover:text-brand-400',
    glow:   'shadow-brand-900/30',
  },
  done: {
    dot:    'bg-emerald-500',
    badge:  'bg-emerald-950 text-emerald-400',
    border: 'border-emerald-900',
    bg:     'bg-surface-900',
    addBtn: 'border-emerald-900 hover:border-emerald-700 hover:text-emerald-400',
    glow:   'shadow-emerald-900/30',
  },
}

export default function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const style = COLUMN_STYLES[column.id]

  return (
    <div className={`
      flex flex-col rounded-2xl border min-w-[300px] w-[300px] flex-shrink-0
      transition-all duration-300
      ${style.bg} ${style.border}
      ${isOver
        ? 'column-drop-active scale-[1.01]'
        : `hover:border-opacity-80 hover:shadow-lg hover:${style.glow}`
      }
    `}>
      {/* Column header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${style.dot} shadow-sm`}
            style={{ boxShadow: isOver ? `0 0 8px currentColor` : '' }}
          />
          <h3 className="font-semibold text-surface-200 text-sm">{column.label}</h3>
          <span className={`ml-1 text-xs font-mono rounded-full px-2 py-0.5 ${style.badge}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-500 hover:text-brand-400 hover:bg-brand-950 transition-all duration-150"
          title={`Adicionar em ${column.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Drop zone indicator */}
      {isOver && (
        <div className="mx-3 mb-2 h-1 rounded-full bg-brand-500/50 animate-pulse" />
      )}

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 px-3 pb-3 flex flex-col gap-2 min-h-[120px]"
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-surface-600 text-xs text-center">
              Nenhuma tarefa aqui.<br />
              <button onClick={onAddTask} className="text-brand-500 hover:text-brand-400 hover:underline mt-1 inline-block transition-colors">
                Adicionar tarefa
              </button>
            </p>
          </div>
        )}

        {tasks.length === 0 && isOver && (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="border-2 border-dashed border-brand-600/50 rounded-xl w-full h-20 flex items-center justify-center">
              <p className="text-brand-400 text-xs font-medium">Soltar aqui</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer add button */}
      <div className="px-3 pb-3">
        <button
          onClick={onAddTask}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-500 border border-dashed transition-all duration-150 ${style.addBtn}`}
        >
          <Plus className="w-4 h-4" />
          Adicionar tarefa
        </button>
      </div>
    </div>
  )
}