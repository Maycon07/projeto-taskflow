// src/components/FilterBar.jsx
import { Search, X } from 'lucide-react'

const PRIORITIES = [
  { value: 'all',    label: 'Todas'  },
  { value: 'high',   label: '🔴 Alta'   },
  { value: 'medium', label: '🟡 Média'  },
  { value: 'low',    label: '🟢 Baixa'  },
]

export default function FilterBar({ search, onSearch, priority, onPriority }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar tarefas..."
          className="input pl-9 pr-8 bg-white"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Priority filter */}
      <div className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-xl px-2 py-1">
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            onClick={() => onPriority(p.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${priority === p.value
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
