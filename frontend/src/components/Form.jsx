import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  // Check username availability (Register only)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (method === "register" && username.length > 2) {
        api
          .post(
            "/api/user/check-username/",
            { username },
            { headers: { "Content-Type": "application/json" } }
          )
          .then(() => setUsernameAvailable(true))
          .catch(() => setUsernameAvailable(false));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  // Password strength feedback (Register only)
  useEffect(() => {
    if (method === "register") {
      const lengthOK = password.length >= 8;
      const upper = /[A-Z]/.test(password);
      const lower = /[a-z]/.test(password);
      const number = /\d/.test(password);
      const symbol = /[\W_]/.test(password);

      if (!password) {
        setPasswordFeedback("");
      } else if (lengthOK && upper && lower && number && symbol) {
        setPasswordFeedback("Strong");
      } else {
        setPasswordFeedback("Weak: Use 8+ chars, upper/lowercase, number, and symbol");
      }
    } else {
      setPasswordFeedback(""); // Clear feedback in login mode
    }
  }, [password, method]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (method === "login" && error.response?.status === 401) {
        setErrorMsg("Invalid username or password.");
      } else if (method === "register") {
        setErrorMsg("Registration failed.");
      } else {
        setErrorMsg("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      <input
        className={`form-input ${
          method === "register" && username && usernameAvailable === false ? "input-error" : ""
        }`}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      {method === "register" && username && (
        <small className="feedback">
          {usernameAvailable === false
            ? "Username is taken"
            : usernameAvailable
            ? "Username available"
            : ""}
        </small>
      )}

      <input
        className={`form-input ${
          method === "register"
            ? passwordFeedback === "Strong"
              ? "input-success"
              : password && "input-warning"
            : ""
        }`}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {method === "register" && password && (
        <small className="feedback">{passwordFeedback}</small>
      )}

      {loading && <LoadingIndicator />}

      <button
        className="form-button"
        type="submit"
        disabled={method === "register" && usernameAvailable === false}
      >
        {name}
      </button>

      {errorMsg && <div className="form-error">{errorMsg}</div>}

      <div className="back-button-container">
        <button
          type="button"
          className="form-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    </form>
  );
}

export default Form;
