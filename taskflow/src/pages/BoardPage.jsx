// src/pages/BoardPage.jsx
import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { signOut } from '../services/auth'
import Header from '../components/Header'
import KanbanColumn from '../components/KanbanColumn'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import FilterBar from '../components/FilterBar'
import toast from 'react-hot-toast'

const COLUMNS = [
  { id: 'todo',        label: 'A Fazer',      color: 'bg-surface-400', light: 'bg-surface-50',  border: 'border-surface-200' },
  { id: 'in_progress', label: 'Em Andamento', color: 'bg-brand-500',   light: 'bg-brand-50',    border: 'border-brand-200'   },
  { id: 'done',        label: 'Concluído',    color: 'bg-emerald-500', light: 'bg-emerald-50',  border: 'border-emerald-200' },
]

export default function BoardPage() {
  const { user } = useAuth()
  const { tasks, tasksByStatus, loading, addTask, editTask, removeTask, moveTaskToColumn } = useTasks()

  const [activeTask, setActiveTask] = useState(null)
  const [modalState, setModalState] = useState({ open: false, task: null, defaultStatus: 'todo' })
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  // Filtragem
  const filteredTasksByStatus = useMemo(() => {
    const filter = (list) =>
      list.filter((t) => {
        const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description || '').toLowerCase().includes(search.toLowerCase())
        const matchPriority = filterPriority === 'all' || t.priority === filterPriority
        return matchSearch && matchPriority
      })
    return {
      todo: filter(tasksByStatus.todo),
      in_progress: filter(tasksByStatus.in_progress),
      done: filter(tasksByStatus.done),
    }
  }, [tasksByStatus, search, filterPriority])

  // Drag handlers
  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const taskId = active.id
    // over.id pode ser o id de uma coluna ou de outro card
    const overColumn = COLUMNS.find((c) => c.id === over.id)
    const overTask = tasks.find((t) => t.id === over.id)
    const newStatus = overColumn?.id || overTask?.status
    if (!newStatus) return

    const draggedTask = tasks.find((t) => t.id === taskId)
    if (!draggedTask || draggedTask.status === newStatus) return

    const colTasks = tasksByStatus[newStatus]
    const newPosition = overTask ? overTask.position : colTasks.length

    moveTaskToColumn(taskId, newStatus, newPosition)
  }

  const openCreateModal = (defaultStatus = 'todo') =>
    setModalState({ open: true, task: null, defaultStatus })

  const openEditModal = (task) =>
    setModalState({ open: true, task, defaultStatus: task.status })

  const closeModal = () =>
    setModalState({ open: false, task: null, defaultStatus: 'todo' })

  const handleSave = async (data) => {
    if (modalState.task) {
      await editTask(modalState.task.id, data)
    } else {
      await addTask({ ...data, status: modalState.defaultStatus })
    }
    closeModal()
  }

  const handleDelete = async (id) => {
    await removeTask(id)
    closeModal()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {
      toast.error('Erro ao sair')
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col px-6 py-6 max-w-screen-2xl mx-auto w-full">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-surface-900 tracking-tight">Meu Board</h2>
            <p className="text-surface-500 text-sm mt-0.5">{tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} no total</p>
          </div>
          <button onClick={() => openCreateModal()} className="btn-primary rounded-xl px-5 py-2.5 shadow-md shadow-brand-200">
            <span className="text-lg leading-none">+</span> Nova tarefa
          </button>
        </div>

        {/* Filtros */}
        <FilterBar
          search={search}
          onSearch={setSearch}
          priority={filterPriority}
          onPriority={setFilterPriority}
        />

        {/* Board */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-5 overflow-x-auto pb-6 flex-1 items-start">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={filteredTasksByStatus[col.id]}
                  onAddTask={() => openCreateModal(col.id)}
                  onEditTask={openEditModal}
                  onDeleteTask={removeTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="drag-overlay">
                  <TaskCard task={activeTask} isDragging />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {modalState.open && (
        <TaskModal
          task={modalState.task}
          defaultStatus={modalState.defaultStatus}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
