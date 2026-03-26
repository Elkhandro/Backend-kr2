import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Отправка данных:", formData);
      const response = await apiClient.post("/auth/register", formData);
      console.log("Ответ:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Полная ошибка:", err);
      console.error("Ответ ошибки:", err.response);
      console.error("Данные ошибки:", err.response?.data);

      // Показываем конкретную ошибку от сервера
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError("Неверные данные. Проверьте заполнение полей.");
      } else if (err.response?.status === 500) {
        setError("Ошибка сервера. Проверьте, запущен ли backend.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Сервер не отвечает. Запустите backend на порту 3000");
      } else {
        setError(
          "Ошибка регистрации: " + (err.message || "Неизвестная ошибка"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Регистрация</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="first_name"
            placeholder="Имя"
            value={formData.first_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Фамилия"
            value={formData.last_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  card: {
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.5rem",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  error: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "0.5rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
};

export default Register;
