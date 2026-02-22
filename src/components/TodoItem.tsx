import { useState } from 'react'
import { Trash2, Pencil, Check, X, Calendar } from 'lucide-react'
import { Todo, Priority } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onUpdate: (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; bg: string; text: string; dot: string }
> = {
  high: {
    label: '高',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  medium: {
    label: '中',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  low: {
    label: '低',
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
  },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
}

function isOverdue(dueDate: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate + 'T00:00:00') < today
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description ?? '')
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '')

  const handleSave = () => {
    if (!editTitle.trim()) return
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description ?? '')
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate ?? '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  const pConf = PRIORITY_CONFIG[isEditing ? editPriority : todo.priority]
  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate)

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-400 dark:border-blue-500 shadow-md p-4 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-base font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
          autoFocus
          maxLength={200}
        />
        <textarea
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="説明（任意）"
          rows={2}
          className="w-full text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 resize-none placeholder-gray-400"
          maxLength={1000}
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              優先度
            </label>
            <select
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as Priority)}
              className="w-full text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 text-gray-700 dark:text-gray-300"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              期日
            </label>
            <input
              type="date"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
              className="w-full text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter で保存 / Esc でキャンセル
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!editTitle.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-2xl border shadow-sm p-4 transition-all duration-150 hover:shadow-md ${
        todo.completed
          ? 'border-gray-100 dark:border-gray-700/50 opacity-60'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
          }`}
          aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
        >
          {todo.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-base font-medium leading-snug break-words ${
              todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {todo.title}
          </p>

          {todo.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 break-words">
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Priority badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${pConf.bg} ${pConf.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pConf.dot}`} />
              {pConf.label}
            </span>

            {/* Due date */}
            {todo.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  overdue
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {overdue ? '期限切れ · ' : ''}
                {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            aria-label="編集"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="削除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
