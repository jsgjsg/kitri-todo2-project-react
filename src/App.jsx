import './App.css'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

function App() {

  return (
    <div className='bg-blue-200 min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex items-center justify-center mb-6'>
          <h1 className='text-4xl font-bold text-black-600 ml-2'>
            Todo list
          </h1>
        </div>
        <TodoInput />
        <TodoList />
      </div>
    </div>
  )
}

export default App;