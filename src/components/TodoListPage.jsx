import { useState, useEffect } from "react";
import axios from "axios";
import TodoInputs from "./TodoInputs";
import TodoList from "./TodoList";
import DeadlineTodoInput from "./DeadlineTodoInput";

const TodoListPage = ({ selectedDate }) => {
  const [todos, setTodos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // 모달 팝업 상태 관리
  const [showAddModals, setShowAddModals] = useState(false); // 모달 팝업 상태 관리
  useEffect(() => {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    console.log(selectedDate);

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    axiosInstance
      .get(`/api/todos/${selectedDate}`)
      .then((res) => {
        console.log(res);
        setTodos(res.data);
      })
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
        // 추가 후 모달 닫기
        setShowAddModal(false);
      })
      .catch((err) => {
        console.error("추가 중 오류 발생", err);
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
      .delete(`/${rmTodo._id}`)
      .then((res) =>
        setTodos(
          todos.filter((todo) => {
            return todo._id !== res.data._id;
          })
        )
      )
      .catch((err) => {
        console.error("삭제 중 오류 발생", err);
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
      .put(`/${modTodo._id}`, modTodo)
      .then((res) =>
        setTodos(
          todos.map((todo) => {
            if (todo._id === res.data._id) return res.data;
            else return todo;
          })
        )
      )
      .catch((err) => {
        console.error("수정 중 오류 발생", err);
      });
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-4xl text-center font-bold text-black-600 ml-2">
            To do list
          </h1>
        </div>

        <div className="flex justify-between mb-4">
          {/* 추가 상자 */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2></h2>
              <h2 className="text-lg text-center font-semibold text-gray-800 mb-2">
                기한 있는 TODO
              </h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300"
                onClick={() => setShowAddModals(true)}
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-900">1</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2></h2>
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-2">
              To-do
            </h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300"
              onClick={() => setShowAddModal(true)}
            >
              +
            </button>
          </div>
          <TodoList todos={todos} delTodo={delTodo} updateTodo={updateTodo} />

          {showAddModal && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold mb-4">
                    Todo-list 추가
                  </h2>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mr-2 hover:bg-red-600 transition duration-300"
                    onClick={() => setShowAddModal(false)}
                  >
                    X
                  </button>
                </div>
                <TodoInputs addTodo={addTodo} />
              </div>
            </div>
          )}
          {showAddModals && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold mb-4">
                    기한있는 Todo-list 추가
                  </h2>
                  <div className="flex justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mr-2 hover:bg-red-600 transition duration-300"
                      onClick={() => setShowAddModals(false)}
                    >
                      X
                    </button>
                  </div>
                </div>
                <DeadlineTodoInput addTodo={addTodo} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;
