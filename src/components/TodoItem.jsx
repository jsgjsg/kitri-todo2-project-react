import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import TodoInputs from "./TodoInputs"; // TodoInputs 컴포넌트 import

function TodoItem({ todo, delTodo, updateTodo, parentOptions }) {
  const { completed, title, dueDate, description, deadlineId, fixOX } = todo;
  const [showEditModal, setShowEditModal] = useState(false); // 수정 모달 상태 관리
  const [showDetailModal, setShowDetailModal] = useState(false); // 상세 정보 모달 상태 관리

  let selectedParent;
  if (parentOptions)
    selectedParent = parentOptions.find((option) => option._id === deadlineId);

  function fixTodo() {
    updateTodo({ ...todo, fixOX: !fixOX }, "/api/todos");
  }

  return (
    <li
      className={`flex justify-between items-center p-4 my-2 rounded-lg shadow-md ${
        fixOX ? "bg-pink-100 border border-pink-200" : "bg-gray-100"
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => {
          updateTodo({ ...todo, completed: !completed }, "/api/todos");
        }}
        className="mr-2 h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-400"
      />
      <span
        onClick={() => setShowDetailModal(true)} // 데이터를 클릭했을 때 상세 정보 모달 표시
        className={`flex-grow ${
          completed ? "line-through text-red-500" : ""
        } cursor-pointer`}
        style={{ textDecorationColor: completed ? "red" : "inherit" }} // 빨간 줄 추가
      >
        {title}
      </span>
      <span className="mr-2 text-gray-500"> {dueDate} </span>
      <div className="flex space-x-2">
        <button
          onClick={() => setShowEditModal(true)} // 수정 모달을 표시
          className="p-2 rounded-full shadow-md transition duration-300 bg-orange-400 hover:bg-orange-500 text-white"
        >
          <FiEdit2 />
        </button>
        <button
          onClick={() => delTodo(todo, "/api/todos")}
          className="p-2 rounded-full shadow-md transition duration-300 bg-red-600 hover:bg-red-700 text-white"
        >
          <FiTrash2 />
        </button>
      </div>

      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Todo Edit</h2>
            <TodoInputs
              addTodo={(updatedTodo) => {
                updateTodo({ ...updatedTodo, _id: todo._id }, "/api/todos");
                setShowEditModal(false); // 수정 모달을 닫음
              }}
              initialData={todo} // 초기 데이터로 현재 todo를 전달
              mode="edit" // 모드를 수정으로 설정
              parentOptions={parentOptions}
            />
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 transition duration-300"
                onClick={() => setShowEditModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Todo Details
              </h2>
              <button
                className={
                  fixOX
                    ? "bg-red-600 text-white px-2 py-2 rounded-md mt-2 mr-2 hover:bg-white transition duration-300"
                    : "bg-white text-red-600 px-2 py-2 rounded-md mt-2 mr-2 hover:bg-red-600 hover:text-white transition duration-300"
                }
                onClick={fixTodo}
              >
                📌
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  <strong>제목:</strong> {title}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  <strong>날짜:</strong> {dueDate}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  <strong>상세정보:</strong> {description}
                </p>
              </div>
              {deadlineId && selectedParent && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600">
                    <strong>상위 Todo:</strong>{" "}
                    <span className="text-blue-600 font-semibold">
                      {selectedParent.title}
                    </span>
                    <strong> | 마감일:</strong>{" "}
                    <span className="text-red-500 font-semibold">
                      {selectedParent.deadline}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                onClick={() => setShowDetailModal(false)}
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

export default TodoItem;
