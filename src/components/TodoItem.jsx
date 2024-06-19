import { FiEdit2, FiTrash2 } from "react-icons/fi";

function TodoItem() {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-4 my-2 rounded-lg shadow-md">
      <span className="flex-grow">리액트 공부하기</span>
      <div className="flex space-x-2">
        <button className="p-2 rounded-full shadow-md transition duration-300 bg-orange-400 hover:bg-orange-500 text-white">
          <FiEdit2 />
        </button>
        <button className="p-2 rounded-full shadow-md transition duration-300 bg-red-600 hover:bg-red-700 text-white">
          <FiTrash2 />
        </button>
      </div>
    </li>
  )
}

export default TodoItem;