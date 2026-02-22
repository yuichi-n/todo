export type Priority = 'high' | 'medium' | 'low'
export type FilterType = 'all' | 'active' | 'completed'
export type SortType = 'createdAt' | 'dueDate' | 'priority' | 'title'

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
}

export interface TodoStats {
  total: number
  completed: number
  active: number
}
