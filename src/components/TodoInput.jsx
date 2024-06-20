import { useRef } from "react";
import { FiPlus } from "react-icons/fi";

function TodoInput({todos, addTodo}) {

  const inputRef = useRef(null);

  function buttonClick() {
    const newTodo = {
      completed: false,
      title: inputRef.current.value
    }
    addTodo(newTodo);
    inputRef.current.value = '';
  }

  return (
    <form className="flex items-center mt-4 bg-green-100 p-2 rounded-lg shadow-md mb-6">
      <input
        ref={inputRef}
        type="text"
        className="focus:ring-0 border-none outline-none p-2 flex-grow bg-green-100"
        placeholder="Add your items"
      ></input>
      <button
        type="button"
        className="bg-green-500 rounded-full text-white p-1.5 m-2 shadow-md hover:bg-green-600 transition duration-300"
        onClick={buttonClick}
      >
        <FiPlus size={20} />
      </button>
    </form>
  )
}

export default TodoInput;