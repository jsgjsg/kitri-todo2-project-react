import TodoItem from "./TodoItem";

function TodoList({todos, delTodo, modCompleted, modTitle}) {
  return (
    <ul>
      {todos.map((todo) => {
        return <TodoItem
                key={todo.id}
                todo = {todo}
                delTodo = {delTodo}
                modCompleted = {modCompleted}
                modTitle = {modTitle}
              />
      })}
    </ul>
  )
}

export default TodoList;