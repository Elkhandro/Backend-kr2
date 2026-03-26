import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axios";

const ProductCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post("/products", {
        ...formData,
        price: parseFloat(formData.price),
      });
      navigate(`/products/${response.data.id}`);
    } catch (error) {
      alert("Ошибка создания");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/products" style={styles.back}>
        ← Назад
      </Link>
      <h2>Создать товар</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Название"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          placeholder="Категория"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Описание"
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          onChange={handleChange}
          required
          step="0.01"
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Создание..." : "Создать"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "500px", margin: "0 auto", padding: "1rem" },
  back: {
    display: "inline-block",
    marginBottom: "1rem",
    color: "#007bff",
    textDecoration: "none",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    minHeight: "100px",
  },
  button: {
    width: "100%",
    padding: "0.5rem",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ProductCreate;
