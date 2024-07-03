import axios from "axios";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DeadlineTodoInput from "./DeadlineTodoInput";

function DeadlineTodoItem({ todo, delTodo, updateTodo, unnecessary }) {
  const { completed, title, deadline, description } = todo;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [childTodo, setChildTodo] = useState([]);

  const handleToggleCompletion = () => {
    updateTodo({ ...todo, completed: !completed }, "/api/deadline");
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    delTodo(todo, `/api/deadline`);
  };

  const handleDetailClick = () => {
    setShowDetailModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDetailModal(false);
  };

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

    axiosInstance
      .get(`/api/deadline/${todo._id}`)
      .then((deadlineres) => {
        console.log(deadlineres.data); // 보류
        setChildTodo(deadlineres.data.todos);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }, []);

  return (
    <li className="flex justify-between items-center bg-gray-300 p-4 my-2 rounded-lg shadow-md">
      <div className="flex items-center w-full">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleCompletion}
          className="mr-2 h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-400"
        />
        <span
          onClick={handleDetailClick}
          className={`flex-grow ${
            completed ? "line-through text-red-500" : ""
          } cursor-pointer`}
          style={{ textDecorationColor: completed ? "red" : "inherit" }}
        >
          {title}
        </span>
        <span className="mr-2"> {deadline} </span>
        {!unnecessary &&
          <div className="flex space-x-2">
            <button
              onClick={handleEditClick}
              className="p-2 rounded-full shadow-md transition duration-300 bg-orange-400 hover:bg-orange-500 text-white"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-full shadow-md transition duration-300 bg-red-600 hover:bg-red-700 text-white"
            >
              <FiTrash2 />
            </button>
          </div>
        }
      </div>

      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Todo Edit</h2>
            <DeadlineTodoInput
              addTodo={(updatedTodo) => {
                updateTodo({ ...updatedTodo, _id: todo._id }, `/api/deadline`);
                handleCloseModals(); // 수정 모달을 닫음
              }}
              initialData={todo} // 초기 데이터로 현재 todo를 전달
              mode="edit" // 모드를 수정으로 설정
              handleCloseModal={handleCloseModals} // 모달 닫기 함수 전달
            />
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 transition duration-300"
                onClick={handleCloseModals}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Todo Details
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  <strong>제목:</strong> {title}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  <strong>기한:</strong> {deadline}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  <strong>상세정보:</strong> {description}
                </p>
              </div>
              {childTodo.length > 0 && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600">
                    <strong>하위 Todo</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    {childTodo.map((child) => (
                      <li key={child._id} className="ml-2 py-1">{child.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                onClick={handleCloseModals}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export default DeadlineTodoItem;
