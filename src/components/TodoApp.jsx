import { useState, useEffect } from "react";
import axios from "axios";
import TodoInputs from "./TodoInputs";
import TodoList from "./TodoList";
import { useNavigate } from "react-router-dom";
import DeadlineTodoInput from "../components/DeadlineTodoInput";
import DeadlineTodoList from "./DeadIineTodoList";

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
        setDeadlineTodos(deadlineres.data);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }, []);

  const parentOptions = deadlineTodos;

  function addTodo(newTodo, endpoint) {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    if (newTodo.title === "") {
      alert("내용을 입력하세요");
      return;
    }
    if (newTodo.dueDate === "") {
      alert("날짜를 입력하세요");
      return;
    }
    axiosInstance
      .post(endpoint, newTodo)
      .then((res) => {
        if (endpoint === "/api/todos") {
          setTodos([...todos, res.data]);
          setShowAddModal(false);
        } else {
          setDeadlineTodos([...deadlineTodos, res.data]);
          setShowAddModals(false); // 수정된 부분
        }
      })
      .catch((err) => {
        console.error("추가 중 오류 발생", err);
      });
  }

  function delTodo(rmTodo, endpoint) {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000", // Express 서버의 주소
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
      },
    });

    axiosInstance
      .delete(`${endpoint}/${rmTodo._id}`)
      .then((res) => {
        if (endpoint === "/api/todos") {
          setTodos(
            todos.filter((todo) => {
              return todo._id !== res.data._id;
            })
          );
        } else {
          setDeadlineTodos(
            deadlineTodos.filter((todo) => {
              return todo._id !== res.data._id;
            })
          );
        }
      })
      .catch((err) => {
        console.error("삭제 중 오류 발생", err);
      });
  }

  function updateTodo(modTodo, endpoint) {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // Axios 인스턴스 생성 및 기본 설정
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000", // Express 서버의 주소
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
      .put(`${endpoint}/${modTodo._id}`, modTodo)
      .then((res) => {
        if (endpoint === "/api/todos") {
          setTodos(
            todos.map((todo) => {
              if (todo._id === res.data._id) return res.data;
              else return todo;
            })
          );
        } else {
          setDeadlineTodos(
            deadlineTodos.map((todo) => {
              if (todo._id === res.data._id) return res.data;
              else return todo;
            })
          );
        }
        window.location.reload();
      })
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
    <div className="bg-pink-50 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-4xl text-center font-bold text-pink-700 ml-2">
            To do list
          </h1>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md w-full border border-pink-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-center font-semibold text-pink-600 mb-2">
                기한 있는 TODO
              </h2>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300"
                onClick={() => setShowAddModals(true)}
              >
                +
              </button>
            </div>
            <DeadlineTodoList
              todos={deadlineTodos}
              delTodo={delTodo}
              updateTodo={updateTodo}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md w-full border border-pink-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-center font-semibold text-pink-600 mb-2">
                To-do
              </h2>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300"
                onClick={() => setShowAddModal(true)}
              >
                +
              </button>
            </div>
            <TodoList
              todos={todos}
              delTodo={delTodo}
              updateTodo={updateTodo}
              parentOptions={parentOptions}
            />

            {showAddModal && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-700">
                      Todo-list 추가
                    </h2>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mr-2 hover:bg-red-600 transition duration-300"
                      onClick={() => setShowAddModal(false)}
                    >
                      X
                    </button>
                  </div>
                  <TodoInputs addTodo={addTodo} parentOptions={parentOptions} />
                </div>
              </div>
            )}
            {showAddModals && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-700">
                      기한있는 Todo-list 추가
                    </h2>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mr-2 hover:bg-red-600 transition duration-300"
                      onClick={() => setShowAddModals(false)}
                    >
                      X
                    </button>
                  </div>
                  <DeadlineTodoInput
                    addTodo={addTodo}
                    showAddModals={showAddModals}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate("/calendar")}
            className="bg-red-400 to-red-500 text-white px-4 py-2 rounded-md hover:bg-red-500 to-red-600 transition duration-300"
          >
            📅 달력
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
