// src/components/KanbanColumn.jsx
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'

export default function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className={`flex flex-col rounded-2xl border ${column.border} ${column.light} min-w-[300px] w-[300px] flex-shrink-0 transition-all duration-200 ${isOver ? 'ring-2 ring-brand-400 ring-offset-2' : ''}`}>
      {/* Column header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-surface-800 text-sm">{column.label}</h3>
          <span className="ml-1 text-xs font-mono bg-surface-200/70 text-surface-500 rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-brand-600 hover:bg-white transition-colors"
          title={`Adicionar em ${column.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

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

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-surface-400 text-xs text-center">
              Nenhuma tarefa aqui.<br />
              <button onClick={onAddTask} className="text-brand-500 hover:underline mt-1 inline-block">
                Adicionar tarefa
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Footer add button */}
      <div className="px-3 pb-3">
        <button
          onClick={onAddTask}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-500 hover:text-brand-600 hover:bg-white border border-dashed border-surface-300 hover:border-brand-300 transition-all duration-150`}
        >
          <Plus className="w-4 h-4" />
          Adicionar tarefa
        </button>
      </div>
    </div>
  )
}
