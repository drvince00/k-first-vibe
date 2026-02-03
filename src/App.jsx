import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  return (
    <div className="todo-app">
      <h1>TODO</h1>
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <p className="todo-count">
          {todos.filter(t => !t.done).length}개 남음 / 총 {todos.length}개
        </p>
      )}
    </div>
  )
}

export default App
