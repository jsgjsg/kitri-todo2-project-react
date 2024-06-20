import './App.css'
import { useState } from 'react'

import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

function App() {

  const [todos, setTodos] = useState([{
    id: 1,
    completed: true,
    title: "리액트 공부하기"
  },
  {
    id: 2,
    completed: false,
    title: "축구 연습하기"
	}]);

  function addTodo(newTodo) {
    console.log(newTodo.title);
    if(newTodo.title == '') {
      alert("내용 입력");
      return;
    }
    setTodos([...todos, {
      id: todos[0] ? todos[todos.length - 1].id + 1 : 1,
      completed: newTodo.completed,
      title: newTodo.title
    }]);
  }

  function delTodo(rmTodo) {
    setTodos(todos.filter((todo) => {
      return todo.id != rmTodo.id;
    }))
  }

  function modCompleted(modTodo) {
    setTodos(todos.map((todo) => {
      if(todo.id == modTodo.id) return modTodo;
      else return todo;
    }))
  }

  function modTitle(modTodo) {
    if(modTodo.title == '') {
      alert("내용 입력");
      return;
    }
    setTodos(todos.map((todo) => {
      if(todo.id == modTodo.id) return modTodo;
      else return todo;
    }))
  }

  return (
    <div className='bg-blue-200 min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex items-center justify-center mb-6'>
          <h1 className='text-4xl font-bold text-black-600 ml-2'>
            Todo list
          </h1>
        </div>
        <TodoInput todos = {todos} addTodo = {addTodo}/>
        <TodoList
          todos = {todos}
          delTodo = {delTodo}
          modCompleted = {modCompleted}
          modTitle = {modTitle}
        />
      </div>
    </div>
  )
}

export default App;