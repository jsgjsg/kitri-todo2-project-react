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
    baseURL: "http://127.0.0.1:3000", // Express 서버의 주소
    headers: {
      Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
      "Content-Type": "application/json",
    },
  });

  // 투두리스트 데이터 가져오는 함수
  useEffect(() => {
    axiosInstance
      .get(`/api/todos/hasDate`)
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });

    axiosInstance
      .get(`/api/deadline/date/hasDate`)
      .then((res) => {
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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-200 to-pink-300">
      <div className="w-full max-w-xl mx-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-4 text-white bg-gradient-to-br from-pink-500 to-pink-600 rounded-full border border-gray-300 shadow-lg hover:scale-105 transition-transform"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-5 py-3 bg-pink-100 border border-pink-300 rounded-full text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
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
              className="px-5 py-3 bg-pink-100 border border-pink-300 rounded-full text-sm font-medium shadow-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {[...Array(12).keys()].map((index) => (
                <option key={index} value={index + 1}>
                  {index + 1}월
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-4 text-white bg-gradient-to-br from-pink-500 to-pink-600 rounded-full border border-gray-300 shadow-lg hover:scale-105 transition-transform"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="text-center mb-6">
          <ul className="flex justify-center space-x-6 mb-4 text-sm font-medium">
            <li className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-red-300 rounded-full ring-2 ring-red-200 shadow-lg"></span>
              <span className="text-red-600">기한 내 해야할 Todo</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-pink-300 rounded-full ring-2 ring-pink-200 shadow-lg"></span>
              <span className="text-pink-600">오늘 해야할 Todo</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-purple-300 rounded-full ring-2 ring-purple-200 shadow-lg"></span>
              <span className="text-purple-600">둘다</span>
            </li>
          </ul>
          <hr className="my-4 border-t-2 border-gray-200" />
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <div key={index} className="text-gray-600">
              {day}
            </div>
          ))}
          {generateCalendar().map((week, index) => (
            <React.Fragment key={index}>
              {week.map((day) => (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`flex items-center justify-center h-14 w-14 rounded-full cursor-pointer transition-transform ${
                    day.isSame(currentMonth, "month")
                      ? today.isSame(day, "day")
                        ? hasTodo(day) && hasDeadline(day)
                          ? "bg-gradient-to-br from-teal-300 to-teal-400 text-white border-2 border-teal-500 shadow-xl hover:scale-110"
                          : hasTodo(day)
                          ? "bg-gradient-to-br from-pink-300 to-pink-400 text-white border-2 border-pink-500 shadow-xl hover:scale-110"
                          : hasDeadline(day)
                          ? "bg-gradient-to-br from-red-300 to-red-400 text-white border-2 border-red-600 shadow-xl hover:scale-110"
                          : "bg-white text-gray-800 border-2 border-gray-300 shadow-md hover:bg-gray-100"
                        : hasTodo(day) && hasDeadline(day)
                        ? "bg-gradient-to-br from-purple-300 to-purple-400 text-white border-2 border-purple-500 shadow-xl hover:scale-110"
                        : hasTodo(day)
                        ? "bg-gradient-to-br from-pink-300 to-pink-400 text-white border-2 border-pink-500 shadow-xl hover:scale-110"
                        : hasDeadline(day)
                        ? "bg-gradient-to-br from-red-300 to-red-400 text-white border-2 border-red-600 shadow-xl hover:scale-110"
                        : "bg-white text-gray-800 border-2 border-gray-300 shadow-md hover:bg-gray-100"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    day.isSame(currentMonth, "month") && handleDateClick(day)
                  }
                >
                  <div
                    className={`text-lg font-semibold ${
                      today.isSame(day, "day") ? "text-teal-500" : ""
                    }`}
                  >
                    {day.date()}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {showTodoModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition duration-300"
                onClick={() => setShowTodoModal(false)}
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <TodoListPage selectedDate={selectedDate} />
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-center px-6 py-3 rounded-full mt-6 hover:from-pink-500 hover:to-pink-600 transition duration-300"
        >
          Todo-list
        </button>
      </div>
    </div>
  );
};

export default Calendar;
