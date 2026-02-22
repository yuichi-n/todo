import { useEffect, useState } from 'react'
import Header from './components/Header'
import AddTodoForm from './components/AddTodoForm'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const {
    todos,
    filter,
    setFilter,
    sort,
    setSort,
    search,
    setSearch,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    stats,
  } = useTodos()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark(d => !d)}
          stats={stats}
        />
        <AddTodoForm onAdd={addTodo} />
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}

export default App
