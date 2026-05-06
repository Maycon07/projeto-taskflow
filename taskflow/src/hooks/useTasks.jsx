// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react'
import { getTasks, createTask, updateTask, deleteTask, moveTask, subscribeToTasks } from '../services/tasks'
import toast from 'react-hot-toast'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carrega todas as tarefas
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar tarefa
  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await createTask(taskData)
      setTasks((prev) => [newTask, ...prev])
      toast.success('Tarefa criada!')
      return newTask
    } catch (err) {
      toast.error('Erro ao criar tarefa: ' + err.message)
      throw err
    }
  }, [])

  // Atualizar tarefa
  const editTask = useCallback(async (id, updates) => {
    try {
      const updated = await updateTask(id, updates)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      toast.success('Tarefa atualizada!')
      return updated
    } catch (err) {
      toast.error('Erro ao atualizar tarefa')
      throw err
    }
  }, [])

  // Deletar tarefa
  const removeTask = useCallback(async (id) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tarefa removida')
    } catch (err) {
      toast.error('Erro ao remover tarefa')
      throw err
    }
  }, [])

  // Mover tarefa (drag and drop)
  const moveTaskToColumn = useCallback(async (id, newStatus, newPosition = 0) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, position: newPosition } : t))
    )
    try {
      await moveTask(id, newStatus, newPosition)
    } catch (err) {
      toast.error('Erro ao mover tarefa')
      loadTasks() // Reverter
    }
  }, [loadTasks])

  // Carregar na montagem
  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToTasks((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload
      if (eventType === 'INSERT') {
        setTasks((prev) => {
          if (prev.find((t) => t.id === newRecord.id)) return prev
          return [newRecord, ...prev]
        })
      } else if (eventType === 'UPDATE') {
        setTasks((prev) => prev.map((t) => (t.id === newRecord.id ? newRecord : t)))
      } else if (eventType === 'DELETE') {
        setTasks((prev) => prev.filter((t) => t.id !== oldRecord.id))
      }
    })
    return unsubscribe
  }, [])

  // Tarefas agrupadas por status
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo').sort((a, b) => a.position - b.position),
    in_progress: tasks.filter((t) => t.status === 'in_progress').sort((a, b) => a.position - b.position),
    done: tasks.filter((t) => t.status === 'done').sort((a, b) => a.position - b.position),
  }

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    moveTaskToColumn,
    reload: loadTasks,
  }
}
