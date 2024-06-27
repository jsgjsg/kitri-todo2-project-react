import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DeadlineTodoInput({ addTodo }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(null); // 날짜 state 추가
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert("내용을 입력하세요");
      return;
    }

    const newTodo = {
      title,
      dueDate: dueDate ? dueDate.toLocaleDateString("en-CA") : "", // 선택된 날짜를 ISO 문자열로 변환
      description,
    };

    addTodo(newTodo, "/api/deadline");

    // 입력 필드 초기화
    setTitle("");
    setDueDate(null);
    setDescription("");
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
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          기한
        </label>
        <DatePicker
          id="dueDate"
          selected={dueDate} // 선택된 날짜
          onChange={(newDate) => {
            console.log(newDate);
            setDueDate(newDate);
          }} // 날짜 선택 시 호출될 함수
          dateFormat="yyyy-MM-dd" // 날짜 포맷 설정 (선택사항)
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
        추가하기
      </button>
    </form>
  );
}

export default DeadlineTodoInput;
