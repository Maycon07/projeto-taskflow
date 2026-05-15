import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import {
  getTasks, createTask, updateTask, deleteTask,
  getColumns, createColumn, updateColumn, deleteColumn,
  createDefaultColumns, notifyAssignedUser,
} from '../services/tasks'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks]     = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      let cols = await getColumns(user.id)
      if (!cols || cols.length === 0) {
        await createDefaultColumns(user.id)
        cols = await getColumns(user.id)
      }
      const tasksData = await getTasks(user.id)
      setColumns(cols)
      setTasks(tasksData)
    } catch (e) {
      toast.error('Erro ao carregar dados')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { loadAll() }, [loadAll])

  // Realtime sem filtro (filtramos no client pelo owner_id)
  useEffect(() => {
    if (!user) return
    const taskChannel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (
            payload.new?.owner_id === user.id ||
            payload.old?.owner_id === user.id
          ) loadAll()
        })
      .subscribe()

    const colChannel = supabase
      .channel('columns-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'columns' },
        (payload) => {
          if (
            payload.new?.user_id === user.id ||
            payload.old?.user_id === user.id
          ) loadAll()
        })
      .subscribe()

    return () => {
      supabase.removeChannel(taskChannel)
      supabase.removeChannel(colChannel)
    }
  }, [user, loadAll])

  const addColumn = async ({ title, color }) => {
    try {
      const position = columns.length
      const col = await createColumn({ userId: user.id, title, color, position })
      setColumns(prev => [...prev, col])
      toast.success('Coluna criada!')
    } catch (e) {
      toast.error('Erro ao criar coluna')
    }
  }

  const editColumn = async (id, updates) => {
    try {
      const updated = await updateColumn(id, updates)
      setColumns(prev => prev.map(c => c.id === id ? updated : c))
    } catch (e) {
      toast.error('Erro ao editar coluna')
    }
  }

  const removeColumn = async (id) => {
    try {
      await deleteColumn(id)
      setColumns(prev => prev.filter(c => c.id !== id))
      setTasks(prev => prev.filter(t => t.column_id !== id))
      toast.success('Coluna removida')
    } catch (e) {
      toast.error('Erro ao remover coluna')
    }
  }

  const addTask = async (taskData) => {
    try {
      const newTask = await createTask({ ...taskData, owner_id: user.id })
      setTasks(prev => [...prev, newTask])
      if (taskData.assigned_email) {
        await notifyAssignedUser({
          taskTitle: taskData.title,
          assignedEmail: taskData.assigned_email,
          assignerName: user.email,
          taskId: newTask.id,
        })
      }
      toast.success('Tarefa criada!')
      return newTask
    } catch (e) {
      toast.error('Erro ao criar tarefa')
      console.error(e)
    }
  }

  const editTask = async (id, updates) => {
    try {
      const prevTask = tasks.find(t => t.id === id)
      const updated = await updateTask(id, updates)
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      if (updates.assigned_email && updates.assigned_email !== prevTask?.assigned_email) {
        await notifyAssignedUser({
          taskTitle: updated.title,
          assignedEmail: updates.assigned_email,
          assignerName: user.email,
          taskId: id,
        })
      }
      toast.success('Tarefa atualizada!')
    } catch (e) {
      toast.error('Erro ao atualizar tarefa')
      console.error(e)
    }
  }

  const removeTask = async (id) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
      toast.success('Tarefa removida')
    } catch (e) {
      toast.error('Erro ao remover tarefa')
    }
  }

  const moveTask = async (taskId, newColumnId) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column_id: newColumnId } : t))
      await updateTask(taskId, { column_id: newColumnId })
    } catch (e) {
      toast.error('Erro ao mover tarefa')
      loadAll()
    }
  }

  return {
    tasks, columns, loading,
    addTask, editTask, removeTask, moveTask,
    addColumn, editColumn, removeColumn,
    reload: loadAll,
  }
}