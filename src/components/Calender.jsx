import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // Import Korean locale
import { useNavigate } from "react-router-dom";
import TodoListPage from "./TodoListPage"; // Import TodoListPage
import axios from "axios";

dayjs.locale("ko"); // Set locale globally

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(currentMonth.year());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.month() + 1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTodoModal, setShowTodoModal] = useState(false); // Add state for showing modal
  const [todos, setTodos] = useState([]); // 투두리스트 데이터를 위한 state 추가
  const [deadline, setDeadline] = useState([]); // 투두리스트 데이터를 위한 state 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  const accessToken = localStorage.getItem("accessToken");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Express 서버의 주소
    headers: {
      Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
      "Content-Type": "application/json",
    },
  });

  // 투두리스트 데이터 가져오는 함수
  useEffect(() => {
    // 여기서 실제 API 호출 등을 통해 데이터를 가져올 수 있습니다.
    axiosInstance
      .get(`/api/todos/hasDate`)
      .then((res) => {
        console.log(res);
        setTodos(res.data);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });

    axiosInstance
      .get(`/api/deadline/date/hasDate`)
      .then((res) => {
        console.log(res);
        setDeadline(res.data);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    updateCurrentMonth(parseInt(e.target.value), selectedMonth);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
    updateCurrentMonth(selectedYear, parseInt(e.target.value));
  };

  const updateCurrentMonth = (year, month) => {
    setCurrentMonth(
      dayjs()
        .year(year)
        .month(month - 1)
    );
  };

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startOfWeek = startOfMonth.startOf("week");
  const endOfWeek = endOfMonth.endOf("week");

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
    setSelectedYear(currentMonth.subtract(1, "month").year());
    setSelectedMonth(currentMonth.subtract(1, "month").month() + 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
    setSelectedYear(currentMonth.add(1, "month").year());
    setSelectedMonth(currentMonth.add(1, "month").month() + 1);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day.format("YYYY-MM-DD"));
    setShowTodoModal(true); // Show modal on date click
  };

  const generateCalendar = () => {
    const calendar = [];
    let startDate = startOfWeek;

    while (startDate.isBefore(endOfWeek)) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => {
            const currentDate = startDate;
            startDate = startDate.add(1, "day");
            return currentDate;
          })
      );
    }

    return calendar;
  };

  const today = dayjs();

  // 투두리스트가 있는 날짜 확인 함수
  const hasTodo = (date) => {
    return todos.some((todo) => todo === date.format("YYYY-MM-DD"));
  };

  // 기한이 있는 날짜 확인 함수
  const hasDeadline = (date) => {
    return deadline.some((todo) => todo === date.format("YYYY-MM-DD"));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              이전
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {[...Array(10).keys()].map((index) => (
                <option key={index} value={dayjs().year() - 5 + index}>
                  {dayjs().year() - 5 + index}년
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {[...Array(12).keys()].map((index) => (
                <option key={index} value={index + 1}>
                  {index + 1}월
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              다음
            </button>
          </div>
        </div>
        <div className="text-center mt-4">
          <ul className="flex space-x-4">
            <li className="flex items-center">
              <span className="w-4 h-4 mr-2 bg-red-600 rounded-full"></span>
              <span className="text-red-600 font-semibold">기한 내 해야할 Todo</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 mr-2 bg-blue-600 rounded-full"></span>
              <span className="text-blue-600 font-semibold">오늘 해야할 Todo</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 mr-2 bg-purple-600 rounded-full"></span>
              <span className="text-purple-600 font-semibold">둘다</span>
            </li>
          </ul>
        </div><br/>
        <hr></hr><br/>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <div key={index} className="font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {generateCalendar().map((week, index) => (
            <React.Fragment key={index}>
              {week.map((day) => (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`p-4 rounded-lg cursor-pointer ${
                    day.isSame(currentMonth, "month")
                      ? today.isSame(day, "day")
                        ? hasTodo(day) && hasDeadline(day)
                          ? "bg-purple-200 text-black-800 shadow-md border-4 border-red-500 transform hover:scale-110 transition-transform"
                          : hasTodo(day)
                          ? "bg-blue-200 text-black-800 shadow-md border-4 border-red-500 transform hover:scale-110 transition-transform"
                          : hasDeadline(day)
                          ? "bg-red-200 text-black-800 shadow-md border-4 border-red-500 transform hover:scale-110 transition-transform"
                          : "bg-white-200 text-black-800 shadow-md border-4 border-red-500"
                        : hasTodo(day) && hasDeadline(day)
                        ? "bg-purple-200 text-black-800 shadow-md transform hover:scale-110 transition-transform"
                        : hasTodo(day)
                        ? "bg-blue-200 text-black-800 shadow-md transform hover:scale-110 transition-transform"
                        : hasDeadline(day)
                        ? "bg-red-200 text-black-800 shadow-md transform hover:scale-110 transition-transform"
                        : "bg-white shadow-md hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="text-lg font-semibold">{day.date()}</div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {showTodoModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 absolute top-4 right-4"
                onClick={() => setShowTodoModal(false)}
              >
                X
              </button>
              <TodoListPage selectedDate={selectedDate} />
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white text-center px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300"
        >
          Todo-list
        </button>
      </div>
    </div>
  );
};

export default Calendar;
