import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { useState } from "react";
import axios from "axios";

function TodoApp() {
  const [todos, setTodos] = useState([]);

  function addTodo(newTodo) {
    if (newTodo.title === "") {
      alert("내용을 입력하세요");
      return;
    }
    axios
      .post("http://localhost:3001/todos", newTodo)
      .then((res) => {
        setTodos([...todos, res.data]);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }

  function delTodo(rmTodo) {
    axios
      .delete(`http://localhost:3001/todos/${rmTodo.id}`)
      .then((res) =>
        setTodos(
          todos.filter((todo) => {
            return todo.id !== res.data.id;
          })
        )
      )
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }

  function updateTodo(modTodo) {
    if (modTodo.title === "") {
      alert("내용을 입력하세요");
      return;
    }

    axios
      .put(`http://localhost:3001/todos/${modTodo.id}`, modTodo)
      .then((res) =>
        setTodos(
          todos.map((todo) => {
            if (todo.id === res.data.id) return res.data;
            else return todo;
          })
        )
      );
  }

  return (
    <div>
      <div className="bg-blue-200 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-bold text-black-600 ml-2">
              To do list
            </h1>
          </div>
          <div className="flex justify-between mb-4"></div>
          <TodoInput addTodo={addTodo} />
          <TodoList todos={todos} delTodo={delTodo} updateTodo={updateTodo} />
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
