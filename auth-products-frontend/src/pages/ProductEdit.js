import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axios";

const ProductEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put(`/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
      });
      navigate(`/products/${id}`);
    } catch (error) {
      alert("Ошибка обновления");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <Link to={`/products/${id}`} style={styles.back}>
        ← Назад
      </Link>
      <h2>Редактировать товар</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          placeholder="Категория"
          value={formData.category}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Описание"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          style={styles.input}
        />
        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? "Сохранение..." : "Сохранить"}
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

export default ProductEdit;
