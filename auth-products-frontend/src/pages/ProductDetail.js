import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Товар не найден");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      navigate("/products");
    } catch (err) {
      alert("Ошибка удаления");
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <Link to="/products" style={styles.backBtn}>
        ← Назад к списку
      </Link>
      <div style={styles.card}>
        <h2>{product.title}</h2>
        <p style={styles.category}>Категория: {product.category}</p>
        <p style={styles.description}>{product.description}</p>
        <p style={styles.price}>Цена: {product.price} ₽</p>
        <div style={styles.buttons}>
          <Link to={`/products/${id}/edit`} style={styles.editBtn}>
            Редактировать
          </Link>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "1rem",
  },
  backBtn: {
    display: "inline-block",
    marginBottom: "1rem",
    color: "#007bff",
    textDecoration: "none",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "2rem",
    backgroundColor: "white",
  },
  category: {
    color: "#666",
    marginBottom: "1rem",
  },
  description: {
    marginBottom: "1rem",
    lineHeight: "1.6",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: "1rem",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
  },
  editBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ffc107",
    color: "black",
    textDecoration: "none",
    borderRadius: "4px",
  },
  deleteBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
};

export default ProductDetail;
