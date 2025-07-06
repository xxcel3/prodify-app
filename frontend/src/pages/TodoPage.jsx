import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/TodoPage.css";

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("M");
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    api.get("/api/todos/")
      .then((res) =>
        setTodos(
          res.data.sort(
            (a, b) => new Date(a.due_date) - new Date(b.due_date)
          )
        )
      )
      .catch(() => alert("Error loading todos"));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    api.post("/api/todos/", {
      task,
      due_date: dueDate || null,
      priority,
    })
      .then(() => {
        setTask("");
        setDueDate("");
        setPriority("M");
        fetchTodos();
      })
      .catch(() => alert("Failed to add task"));
  };

  const toggleTodo = (todo) => {
    api.patch(`/api/todos/${todo.id}/`, { completed: !todo.completed })
      .then(fetchTodos);
  };

  const deleteTodo = (id) => {
    api.delete(`/api/todos/${id}/`).then(fetchTodos);
  };

  // Pagination logic
  const indexOfLast = currentPage * todosPerPage;
  const indexOfFirst = indexOfLast - todosPerPage;
  const currentTodos = todos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(todos.length / todosPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>My To-Do List</h2>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="H">High</option>
          </select>
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {currentTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    className="todo-checkbox"
                />
                <div className="todo-main" onClick={() => toggleTodo(todo)}>
                    <strong>{todo.task}</strong>
                    <div className="meta">
                    {todo.due_date && <span>Due: {todo.due_date}</span>}
                    <span>Priority: {todo.priority}</span>
                    </div>
                </div>
                <div className="todo-actions">
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
            </li>
          ))}
        </ul>

        <div className="pagination-controls">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default TodoPage;
