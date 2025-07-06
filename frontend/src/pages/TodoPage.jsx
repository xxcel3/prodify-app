import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/TodoPage.css";

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    api.get("/api/todos/")
      .then((res) => setTodos(res.data))
      .catch(() => alert("Error loading todos"));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    api.post("/api/todos/", { task })
      .then(() => {
        setTask("");
        fetchTodos();
      })
      .catch(() => alert("Failed to add task"));
  };

  const toggleTodo = (todo) => {
    api.patch(`/api/todos/${todo.id}/`, { completed: !todo.completed })
      .then(fetchTodos);
  };

  const deleteTodo = (id) => {
    api.delete(`/api/todos/${id}/`)
      .then(fetchTodos)
      .catch(() => alert("Failed to delete task"));
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h2>My To-Do List</h2>
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Add a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? "done" : ""}`}>
              <span onClick={() => toggleTodo(todo)}>{todo.task}</span>
              <div className="todo-actions">
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default TodoPage;
