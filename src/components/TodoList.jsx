import TodoItem from "./TodoItem";

function TodoList({ todos, delTodo, updateTodo, parentOptions }) {
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            delTodo={delTodo}
            updateTodo={updateTodo}
            parentOptions = {parentOptions}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;
