import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TodoInputs({ addTodo, initialData, mode, parentOptions }) {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [dueDate, setDueDate] = useState(
    initialData ? new Date(initialData.dueDate) : null
  );
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [parentId, setParentId] = useState("");

  // 초기 데이터가 있을 경우 parentId 상태 설정
  
  useEffect(() => {
    console.log(initialData);
    if (initialData && initialData.deadlineId) {
      setParentId(initialData.deadlineId);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert("내용을 입력하세요");
      return;
    }
    if (!dueDate) {
      alert("날짜를 입력하세요");
      return;
    }

    // 선택된 parentId에 해당하는 옵션 찾기
    const selectedParent = parentOptions.find(option => option._id === parentId);
    console.log(selectedParent);
    const newTodo = {
      title,
      dueDate: dueDate ? dueDate.toLocaleDateString("en-CA") : "",
      description,
      parentId: selectedParent ? selectedParent._id : "", // 선택된 옵션의 _id 사용
    };

    console.log(newTodo);

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
          상위 투두리스트 (선택)
        </label>
        <select
          id="parentId"
          className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option key="select" value="">선택하세요</option>
          {parentOptions.map((option) => (
            <option key={option._id} value={option._id}>
              {option.title}
            </option>
          ))}
        </select>
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