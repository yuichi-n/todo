import { useState } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { Priority } from '../types/todo'
import { AddTodoData } from '../hooks/useTodos'

interface AddTodoFormProps {
  onAdd: (data: AddTodoData) => void
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '高', color: 'text-red-600 dark:text-red-400' },
  { value: 'medium', label: '中', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'low', label: '低', color: 'text-green-600 dark:text-green-400' },
]

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setIsExpanded(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-5"
    >
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          aria-label="タスクを追加"
        >
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="新しいタスクを追加..."
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-base"
          maxLength={200}
        />
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="詳細オプション"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="説明（任意）"
            rows={2}
            className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/40 resize-none transition-all"
            maxLength={1000}
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                優先度
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 text-gray-700 dark:text-gray-300 transition-all"
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                期日
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={today}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
