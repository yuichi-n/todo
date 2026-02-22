import { useState, useEffect, useCallback, useMemo } from 'react'
import { Todo, FilterType, SortType, Priority, TodoStats } from '../types/todo'

const STORAGE_KEY = 'todo-app-v1'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export interface AddTodoData {
  title: string
  description?: string
  priority: Priority
  dueDate?: string
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('createdAt')
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((data: AddTodoData) => {
    const newTodo: Todo = {
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...data,
    }
    setTodos(prev => [newTodo, ...prev])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const updateTodo = useCallback(
    (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, ...data } : todo)),
      )
    },
    [],
  )

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }, [])

  const filteredAndSortedTodos = useMemo(() => {
    let result = todos

    if (filter === 'active') {
      result = result.filter(t => !t.completed)
    } else if (filter === 'completed') {
      result = result.filter(t => t.completed)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      )
    }

    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        }
        case 'title':
          return a.title.localeCompare(b.title, 'ja')
        default:
          return b.createdAt.localeCompare(a.createdAt)
      }
    })

    return result
  }, [todos, filter, sort, search])

  const stats: TodoStats = useMemo(
    () => ({
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
    }),
    [todos],
  )

  return {
    todos: filteredAndSortedTodos,
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
  }
}
