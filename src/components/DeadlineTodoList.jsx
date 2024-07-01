import DeadlineTodoItem from "./DeadlineTodoItem";

function DeadlineTodoList({ todos, delTodo, updateTodo }) {
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <DeadlineTodoItem
            key={todo.id}
            todo={todo}
            delTodo={delTodo}
            updateTodo={updateTodo}
          />
        );
      })}
    </ul>
  );
}

export default DeadlineTodoList;
