import { supabase } from './supabase'

export async function uploadAttachment({ taskId, userId, file }) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${taskId}/${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('task-attachments')
    .upload(path, file, { upsert: false })

  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from('task_attachments')
    .insert([{
      task_id: taskId,
      user_id: userId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: path,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAttachments(taskId) {
  const { data, error } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function deleteAttachment(id, storagePath) {
  await supabase.storage.from('task-attachments').remove([storagePath])
  const { error } = await supabase.from('task_attachments').delete().eq('id', id)
  if (error) throw error
}

export async function getAttachmentUrl(storagePath) {
  const { data } = await supabase.storage
    .from('task-attachments')
    .createSignedUrl(storagePath, 3600)
  return data?.signedUrl
}

export function getFileIcon(fileType, fileName) {
  const ext = fileName?.split('.').pop()?.toLowerCase()
  if (fileType?.includes('pdf') || ext === 'pdf') return '📄'
  if (fileType?.includes('word') || ext === 'doc' || ext === 'docx') return '📝'
  if (fileType?.includes('excel') || ext === 'xls' || ext === 'xlsx') return '📊'
  if (fileType?.includes('image') || ['png','jpg','jpeg','gif','webp'].includes(ext)) return '🖼️'
  if (fileType?.includes('zip') || ext === 'zip' || ext === 'rar') return '🗜️'
  return '📎'
}

export function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}