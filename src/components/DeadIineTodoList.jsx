import DeadlineTodoItem from "./DeadlineTodoItem";

function DeadlineTodoList({ todos, delTodo, updateTodo, unnecessary }) {
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <DeadlineTodoItem
            key={todo.id}
            todo={todo}
            delTodo={delTodo}
            updateTodo={updateTodo}
            unnecessary={unnecessary}
          />
        );
      })}
    </ul>
  );
}

export default DeadlineTodoList;
