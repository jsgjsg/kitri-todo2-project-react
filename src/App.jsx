import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Login from "./components/loing";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => {
        console.error("Error occurred on fetching", err);
      });
  }, []);

  function addTodo(newTodo) {
    if (newTodo.title == "") {
      alert("내용 입력");
      return;
    }
    axios
      .post("http://localhost:3001/todos", newTodo)
      .then((res) => {
        setTodos([...todos, res.data]);
      })
      .catch((err) => {
        console.error("Error occurred on fetching", err);
      });
  }

  function delTodo(rmTodo) {
    // 뒤에 id 붙이기
    axios
      .delete(`http://localhost:3001/todos/${rmTodo.id}`)
      .then((res) =>
        setTodos(
          todos.filter((todo) => {
            return todo.id != res.data.id;
          })
        )
      )
      .catch((err) => {
        console.error("Error occurred on fetching", err);
      });
  }

  function updateTodo(modTodo) {
    if (modTodo.title == "") {
      alert("내용 입력");
      return;
    }

    axios
      .put(`http://localhost:3001/todos/${modTodo.id}`, modTodo)
      .then((res) =>
        setTodos(
          todos.map((todo) => {
            if (todo.id == res.data.id) return res.data;
            else return todo;
          })
        )
      );
  }

  return (
    <div className="bg-blue-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-4xl font-bold text-black-600 ml-2">Todo list</h1>
        </div>
        <TodoInput todos={todos} addTodo={addTodo} />
        <TodoList todos={todos} delTodo={delTodo} updateTodo={updateTodo} />
      </div>
    </div>
    // <div className="App">
    //   <Login />
    // </div>
  );
}

export default App;
