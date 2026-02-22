import { Inbox } from 'lucide-react'
import { Todo } from '../types/todo'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onUpdate: (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onToggle, onUpdate, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
        <Inbox className="w-14 h-14 mb-4 opacity-40" />
        <p className="text-base font-medium">タスクがありません</p>
        <p className="text-sm mt-1 opacity-70">上のフォームから追加してください</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
