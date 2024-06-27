import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TodoInputs({ addTodo, initialData, mode }) {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [dueDate, setDueDate] = useState(
    initialData ? new Date(initialData.dueDate) : null
  );
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [parentId, setParentId] = useState(
    initialData ? initialData.parentId : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert("내용을 입력하세요");
      return;
    }

    const newTodo = {
      title,
      dueDate: dueDate ? dueDate.toLocaleDateString("en-CA") : "",
      description,
      parentId,
    };

    addTodo(newTodo, "/api/todos");

    // 입력 필드 초기화
    setTitle("");
    setDueDate(null);
    setDescription("");
    setParentId("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          {mode === "edit" ? "수정할 제목" : "투두리스트"}
        </label>
        <input
          type="text"
          id="title"
          placeholder="투두리스트"
          className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          날짜
        </label>
        <DatePicker
          id="dueDate"
          selected={dueDate}
          onChange={(newDate) => setDueDate(newDate)}
          dateFormat="yyyy-MM-dd"
          className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholderText="날짜를 선택하세요"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          상세정보
        </label>
        <textarea
          id="description"
          placeholder="상세정보"
          className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="parentId"
          className="block text-sm font-medium text-gray-700"
        >
          상위 투두리스트 ID (선택)
        </label>
        <input
          type="text"
          id="parentId"
          placeholder="상위 투두리스트 ID"
          className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300 focus:outline-none"
      >
        {mode === "edit" ? "수정하기" : "추가하기"}
      </button>
    </form>
  );
}

export default TodoInputs;
