import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
}) {
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(column.title)
  const [colorDraft, setColorDraft] = useState(column.color || '#6366f1')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  })

  const handleSaveEdit = () => {
    if (titleDraft.trim()) {
      onEditColumn(column.id, { title: titleDraft.trim(), color: colorDraft })
      setEditing(false)
    }
  }

  const PRESET_COLORS = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  ]

  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      {/* Header da coluna */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-xl mb-1"
        style={{ backgroundColor: colorDraft + '22', borderTop: `3px solid ${colorDraft}` }}
      >
        {editing ? (
          <div className="flex-1 flex flex-col gap-2">
            <input
              autoFocus
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 outline-none border border-gray-600 focus:border-indigo-500"
              onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditing(false) }}
            />
            <div className="flex gap-1 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColorDraft(c)}
                  className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: colorDraft === c ? '#fff' : 'transparent' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={handleSaveEdit} className="flex-1 flex items-center justify-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded py-1">
                <Check className="w-3 h-3" /> Salvar
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded py-1">
                <X className="w-3 h-3" /> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colorDraft }}
              />
              <h3 className="font-semibold text-white text-sm truncate">{column.title}</h3>
              <span className="text-xs text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {tasks.length}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => { setTitleDraft(column.title); setColorDraft(column.color || '#6366f1'); setEditing(true) }}
                className="p-1 text-gray-500 hover:text-gray-300 rounded transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDeleteColumn(column.id)}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-gray-500 hover:text-gray-300"
                  >
                    Não
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Drop zone com cards */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 p-2 rounded-b-xl min-h-[120px] transition-colors ${
          isOver ? 'bg-gray-800/70' : 'bg-gray-900/50'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>

        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300
            px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors mt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar tarefa
        </button>
      </div>
    </div>
  )
}