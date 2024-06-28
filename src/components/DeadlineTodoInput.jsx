import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DeadlineTodoInput({ addTodo, initialData, mode, handleCloseModal }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setDeadline(new Date(initialData.deadline));
      setDescription(initialData.description);
    }
  }, [mode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력하세요");
      return;
    }

    const updatedTodo = {
      title: title.trim(),
      deadline: deadline ? deadline.toLocaleDateString("en-CA") : "",
      description: description.trim(),
    };

    if (mode === "edit") {
      addTodo({ ...initialData, ...updatedTodo }, "/api/deadline");
    } else {
      addTodo(updatedTodo, "/api/deadline");
    }

    // 입력 필드 초기화
    setTitle("");
    setDeadline(null);
    setDescription("");

    handleCloseModal();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          투두리스트
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
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700"
        >
          기한
        </label>
        <DatePicker
          id="deadline"
          selected={deadline}
          onChange={(newDate) => {
            setDeadline(newDate);
          }}
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300 focus:outline-none"
      >
        {mode === "edit" ? "수정하기" : "추가하기"}
      </button>
    </form>
  );
}

export default DeadlineTodoInput;
