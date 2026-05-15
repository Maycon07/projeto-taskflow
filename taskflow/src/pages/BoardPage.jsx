import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import Header from '../components/Header'
import FilterBar from '../components/FilterBar'
import { KanbanColumn } from '../components/KanbanColumn'
import { TaskCard } from '../components/TaskCard'
import { TaskModal } from '../components/TaskModal'
import { AddColumnModal } from '../components/AddColumnModal'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../services/supabase'
import { Plus, Loader2 } from 'lucide-react'

export default function BoardPage() {
  const { user } = useAuth()
  const {
    tasks, columns, loading,
    addTask, editTask, removeTask, moveTask,
    addColumn, editColumn, removeColumn,
  } = useTasks()

  const [search, setSearch]                 = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [activeTask, setActiveTask]         = useState(null)
  const [taskModal, setTaskModal]           = useState({ open: false, task: null, columnId: null })
  const [columnModal, setColumnModal]       = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleSignOut = () => supabase.auth.signOut()

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchSearch && matchPriority
  })

  const getTasksForColumn = (columnId) =>
    filteredTasks.filter(t => t.column_id === columnId)

  function handleDragStart({ active }) {
    setActiveTask(tasks.find(t => t.id === active.id) || null)
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return
    const newColumnId = over.data?.current?.columnId || over.id
    const task = tasks.find(t => t.id === active.id)
    if (task && task.column_id !== newColumnId) {
      moveTask(active.id, newColumnId)
    }
  }

  const openCreateModal = (columnId) =>
    setTaskModal({ open: true, task: null, columnId })

  const openEditModal = (task) =>
    setTaskModal({ open: true, task, columnId: task.column_id })

  const handleSaveTask = async (data) => {
    if (taskModal.task) {
      await editTask(taskModal.task.id, data)
    } else {
      await addTask({ ...data, column_id: taskModal.columnId })
    }
    setTaskModal({ open: false, task: null, columnId: null })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="px-6 py-4">
        <FilterBar
          search={search}
          onSearch={setSearch}
          priority={filterPriority}
          onPriority={setFilterPriority}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 px-6 pb-6 overflow-x-auto items-start">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={getTasksForColumn(col.id)}
              onAddTask={() => openCreateModal(col.id)}
              onEditTask={openEditModal}
              onDeleteTask={removeTask}
              onEditColumn={editColumn}
              onDeleteColumn={removeColumn}
            />
          ))}

          <button
            onClick={() => setColumnModal(true)}
            className="flex-shrink-0 w-72 h-14 flex items-center justify-center gap-2
              border-2 border-dashed border-gray-700 rounded-xl text-gray-500
              hover:border-indigo-500 hover:text-indigo-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Nova coluna</span>
          </button>
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          columns={columns}
          defaultColumnId={taskModal.columnId}
          onSave={handleSaveTask}
          onClose={() => setTaskModal({ open: false, task: null, columnId: null })}
        />
      )}

      {columnModal && (
        <AddColumnModal
          onSave={addColumn}
          onClose={() => setColumnModal(false)}
        />
      )}
    </div>
  )
}
