import { Moon, Sun } from 'lucide-react'
import { TodoStats } from '../types/todo'

interface HeaderProps {
  isDark: boolean
  onToggleDark: () => void
  stats: TodoStats
}

export default function Header({ isDark, onToggleDark, stats }: HeaderProps) {
  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Todo
          </h1>
          {stats.total > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {stats.active} 件の未完了タスク
            </p>
          )}
        </div>
        <button
          onClick={onToggleDark}
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {stats.total > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{stats.completed} / {stats.total} 完了</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
