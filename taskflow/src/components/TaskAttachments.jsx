import { useState, useEffect, useRef } from 'react'
import { Paperclip, Upload, Trash2, Download, Loader2, X } from 'lucide-react'
import { uploadAttachment, getAttachments, deleteAttachment, getAttachmentUrl, getFileIcon, formatFileSize } from '../services/attachments'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export function TaskAttachments({ taskId }) {
  const { user } = useAuth()
  const [attachments, setAttachments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loadingUrl, setLoadingUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!taskId) return
    getAttachments(taskId).then(setAttachments).catch(() => {})
  }, [taskId])

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande (máx 20MB)`)
        continue
      }
      setUploading(true)
      try {
        const attachment = await uploadAttachment({ taskId, userId: user.id, file })
        setAttachments(prev => [...prev, attachment])
        toast.success(`${file.name} enviado!`)
      } catch (e) {
        toast.error(`Erro ao enviar ${file.name}`)
      } finally {
        setUploading(false)
      }
    }
    e.target.value = ''
  }

  const handleDownload = async (attachment) => {
    setLoadingUrl(attachment.id)
    try {
      const url = await getAttachmentUrl(attachment.storage_path)
      if (url) window.open(url, '_blank')
    } catch {
      toast.error('Erro ao abrir arquivo')
    } finally {
      setLoadingUrl(null)
    }
  }

  const handleDelete = async (attachment) => {
    try {
      await deleteAttachment(attachment.id, attachment.storage_path)
      setAttachments(prev => prev.filter(a => a.id !== attachment.id))
      toast.success('Anexo removido')
    } catch {
      toast.error('Erro ao remover anexo')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
          <Paperclip className="w-3.5 h-3.5" />
          Anexos {attachments.length > 0 && <span className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{attachments.length}</span>}
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Enviando...' : 'Adicionar'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.zip,.rar,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {attachments.map(att => (
            <div key={att.id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 group">
              <span className="text-base flex-shrink-0">{getFileIcon(att.file_type, att.file_name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">{att.file_name}</p>
                {att.file_size && <p className="text-xs text-gray-500">{formatFileSize(att.file_size)}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleDownload(att)}
                  disabled={loadingUrl === att.id}
                  className="p-1 text-gray-500 hover:text-indigo-400 rounded transition-colors"
                  title="Abrir"
                >
                  {loadingUrl === att.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Download className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(att)}
                  className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {attachments.length === 0 && !uploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-dashed border-gray-700 rounded-lg py-3 text-xs text-gray-600 hover:text-gray-400 hover:border-gray-600 transition-colors"
        >
          Clique para adicionar PDF, Word, imagem...
        </button>
      )}
    </div>
  )
}