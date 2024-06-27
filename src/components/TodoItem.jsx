import { useRef, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

function TodoItem({ todo, delTodo, updateTodo }) {
  const { completed, title, dueDate } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isModify, setIsModify] = useState(false);

  const completedRef = useRef(null);
  const inputRef = useRef(null);

  // line-through
  if (!isModify)
    return (
      <li className="flex justify-between items-center bg-gray-300 p-4 my-2 rounded-lg shadow-md">
        <span
          onClick={() => {
            updateTodo({ ...todo, completed: !completed });
          }}
          ref={completedRef}
          className={`flex-grow ${completed ? "line-through" : ""}`}
        >
          {title}
        </span>
        <span className="mr-2"> {dueDate} </span>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsModify(!isModify);
            }}
            className="p-2 rounded-full shadow-md transition duration-300 bg-orange-400 hover:bg-orange-500 text-white"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => {
              delTodo(todo, "/api/todos");
            }}
            className="p-2 rounded-full shadow-md transition duration-300 bg-red-600 hover:bg-red-700 text-white"
          >
            <FiTrash2 />
          </button>
        </div>
      </li>
    );
  else
    return (
      <li className="flex justify-between items-center bg-gray-100 p-4 my-2 rounded-lg shadow-md">
        <input
          ref={inputRef}
          className="flex-grow"
          value={newTitle}
          onChange={() => setNewTitle(inputRef.current.value)}
        ></input>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              updateTodo({ ...todo, title: newTitle });
              setIsModify(!isModify);
            }}
            className="p-2 rounded-full shadow-md transition duration-300 bg-green-400 hover:bg-green-500 text-white"
          >
            <FiCheck />
          </button>
          <button
            onClick={() => {
              setNewTitle(title);
              setIsModify(!isModify);
            }}
            className="p-2 rounded-full shadow-md transition duration-300 bg-pink-400 hover:bg-pink-500 text-white"
          >
            <FiX />
          </button>
        </div>
      </li>
    );
}

export default TodoItem;
