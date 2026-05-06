// src/services/tasks.js
// ============================================================
// Todas as operações de banco de dados para tarefas
// ============================================================
import { supabase } from './supabase'

// Buscar todas as tarefas do usuário logado
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Criar nova tarefa
export async function createTask({ title, description, status = 'todo', priority = 'medium', due_date = null }) {
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar a maior posição atual para colocar no final
  const { data: existing } = await supabase
    .from('tasks')
    .select('position')
    .eq('status', status)
    .order('position', { ascending: false })
    .limit(1)

  const position = existing?.[0]?.position != null ? existing[0].position + 1 : 0

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      status,
      priority,
      due_date: due_date || null,
      owner_id: user.id,
      owner_email: user.email,
      owner_name: user.user_metadata?.full_name || user.email.split('@')[0],
      position,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Atualizar tarefa existente
export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Deletar tarefa
export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Mover tarefa para outro status (drag and drop)
export async function moveTask(id, newStatus, newPosition) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status: newStatus, position: newPosition })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Subscrever atualizações em tempo real
export function subscribeToTasks(callback) {
  const channel = supabase
    .channel('tasks_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      (payload) => callback(payload)
    )
    .subscribe()

  // Retorna função de cleanup
  return () => supabase.removeChannel(channel)
}
