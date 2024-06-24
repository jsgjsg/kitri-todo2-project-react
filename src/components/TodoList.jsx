import TodoItem from "./TodoItem";

function TodoList({todos, delTodo, updateTodo}) {
  return (
    <ul>
      {todos.map((todo) => {
        return <TodoItem
                key={todo.id}
                todo = {todo}
                delTodo = {delTodo}
                updateTodo = {updateTodo}
              />
      })}
    </ul>
  )
}

export default TodoList;