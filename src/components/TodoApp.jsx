import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoInputs from "./TodoInputs";
import TodoList from "./TodoList";
import { useNavigate } from "react-router-dom";
import DeadlineTodoInput from "./DeadlineTodoInput";

function TodoApp() {
  const [deadlineTodos, setDeadlineTodos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // 모달 팝업 상태 관리
  const [showAddModals, setShowAddModals] = useState(false); // 모달 팝업 상태 관리
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) navigate("/login");
    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    Promise.all([
      axiosInstance.get("/api/todos"),
      axiosInstance.get("/api/deadline"),
    ])
      .then(([todosres, deadlineres]) => {
        // 당일 Todo
        let fixO = todosres.data.filter((todo) => todo.fixOX == true);
        let ascByDate1 = fixO.sort(
          (a, b) =>
            Number(a.dueDate.split("-").join("")) -
            Number(b.dueDate.split("-").join(""))
        );
        let fixX = todosres.data.filter((todo) => todo.fixOX == false);
        let ascByDate2 = fixX.sort(
          (a, b) =>
            Number(a.dueDate.split("-").join("")) -
            Number(b.dueDate.split("-").join(""))
        );
        setTodos([...ascByDate1, ...ascByDate2]);
        // 마감일이 있는 Todo
        fixO = deadlineres.data.filter((todo) => todo.fixOX == true);
        ascByDate1 = fixO.sort(
          (a, b) =>
            Number(a.dueDate.split("-").join("")) -
            Number(b.dueDate.split("-").join(""))
        );
        fixX = deadlineres.data.filter((todo) => todo.fixOX == false);
        ascByDate2 = fixX.sort(
          (a, b) =>
            Number(a.dueDate.split("-").join("")) -
            Number(b.dueDate.split("-").join(""))
        );
        setDeadlineTodos([...ascByDate1, ...ascByDate2]);
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

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:3000/api/auth/logout",
        localStorage.getItem("refreshToken")
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error("추가 중 오류 발생", err);
      });
    // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Logged out successfully!");
    navigate("/login"); // 로그인 화면으로 리다이렉트
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-red-600 transition duration-300"
      >
        로그아웃
      </button>
      <div className="bg-white flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl text-center font-bold text-black-600 ml-2">
              To do list
            </h1>
            <button
              onClick={() => navigate("/calendar")}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-green-600 transition duration-300"
            >
              📅 달력
            </button>
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
    </div>
  );
}

export default TodoApp;
