import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Calender from "./components/Calender";
import SignUp from "./components/SignUp";
import TodoApp from "./components/TodoApp";

function App() {
  const [setTodos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => {
        console.error("불러오기 중 오류 발생", err);
      });
  }, []);

  return (
    <Router>
      <div className="flex justify-between mb-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
        <Link to="/signup" className="text-blue-600 hover:underline">
          회원가입
        </Link>
        <Link to="/calendar" className="text-blue-600 hover:underline">
          달력
        </Link>
        <Link to="/" className="text-blue-600 hover:underline">
          메인 화면
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/calendar" element={<Calender />} />
      </Routes>
    </Router>
  );
}

export default App;
