import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Calender from "./components/Calender"; // Calender 오타 수정
import SignUp from "./components/SignUp";
import TodoApp from "./components/TodoApp";
import TodoListPage from "./components/TodoListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/calendar" element={<Calender />} />
        <Route path="/todo/:date" element={<TodoListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
