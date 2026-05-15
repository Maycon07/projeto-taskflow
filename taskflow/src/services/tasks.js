import { supabase } from './supabase'

// ─── COLUMNS ────────────────────────────────────────────────────────────────

export async function getColumns() {
  const { data, error } = await supabase
    .from('columns')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createColumn({ userId, title, color = '#6366f1', position }) {
  const { data, error } = await supabase
    .from('columns')
    .insert([{ user_id: userId, title, color, position }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateColumn(id, updates) {
  const { data, error } = await supabase
    .from('columns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteColumn(id) {
  const { error } = await supabase.from('columns').delete().eq('id', id)
  if (error) throw error
}

export async function createDefaultColumns(userId) {
  const { error } = await supabase.rpc('create_default_columns', { p_user_id: userId })
  if (error) throw error
}

// ─── TASKS ──────────────────────────────────────────────────────────────────

export async function getTasks(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_profile:profiles!assigned_to (
        id, email, full_name, avatar_url
      )
    `)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createTask(task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select(`
      *,
      assigned_profile:profiles!assigned_to (
        id, email, full_name, avatar_url
      )
    `)
    .single()
  if (error) throw error
  return data
}

export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      assigned_profile:profiles!assigned_to (
        id, email, full_name, avatar_url
      )
    `)
    .single()
  if (error) throw error
  return data
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export async function searchUserByEmail(email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .ilike('email', `%${email}%`)
    .limit(5)
  if (error) throw error
  return data
}

export async function notifyAssignedUser({ taskTitle, assignedEmail, assignerName, taskId }) {
  try {
    const res = await fetch(
      'https://zzdwejvecyzulezxjkol.supabase.co/functions/v1/notify-assigned',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, assignedEmail, assignerName, taskId }),
      }
    )
    if (!res.ok) {
      const err = await res.text()
      console.warn('Notificação não enviada:', err)
    }
  } catch (e) {
    console.warn('Erro ao chamar Edge Function:', e.message)
  }
}