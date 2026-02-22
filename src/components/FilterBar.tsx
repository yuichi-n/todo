import { Search, X } from 'lucide-react'
import { FilterType, SortType } from '../types/todo'

interface FilterBarProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  sort: SortType
  onSortChange: (sort: SortType) => void
  search: string
  onSearchChange: (search: string) => void
  completedCount: number
  onClearCompleted: () => void
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
]

const SORTS: { value: SortType; label: string }[] = [
  { value: 'createdAt', label: '作成日順' },
  { value: 'priority', label: '優先度順' },
  { value: 'dueDate', label: '期日順' },
  { value: 'title', label: 'タイトル順' },
]

export default function FilterBar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="space-y-3 mb-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="検索をクリア"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter tabs + Sort + Clear */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all font-medium ${
                filter === value
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value as SortType)}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          >
            {SORTS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors whitespace-nowrap font-medium"
            >
              完了を削除
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
