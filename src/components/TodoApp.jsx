import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { useState, useEffect } from "react";
import axios from "axios";

function TodoApp() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3001", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    axiosInstance
      .get("http://localhost:3000/api/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }, []);

  function addTodo(newTodo) {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000/api/todos", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    if (newTodo.title === "") {
      alert("내용을 입력하세요");
      return;
    }
    axiosInstance
      .post("/", newTodo)
      .then((res) => {
        setTodos([...todos, res.data]);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }

  function delTodo(rmTodo) {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000/api/todos", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
      },
    });

    axiosInstance
      .delete(`/${rmTodo.id}`)
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
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000/api/todos", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    if (modTodo.title === "") {
      alert("내용을 입력하세요");
      return;
    }

    axiosInstance
      .put(`/${modTodo.id}`, modTodo)
      .then((res) =>
        setTodos(
          todos.map((todo) => {
            if (todo.id === res.data.id) return res.data;
            else return todo;
          })
        )
      )
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
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
