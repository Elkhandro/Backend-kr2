import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      navigate("/products");
    } catch (error) {
      alert("Ошибка удаления");
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;
  if (!product) return <div>Товар не найден</div>;

  return (
    <div style={styles.container}>
      <Link to="/products" style={styles.back}>
        ← Назад
      </Link>
      <div style={styles.card}>
        <h2>{product.title}</h2>
        <p>Категория: {product.category}</p>
        <p>{product.description}</p>
        <p style={styles.price}>{product.price} ₽</p>
        <div style={styles.buttons}>
          <Link to={`/products/${id}/edit`} style={styles.edit}>
            Редактировать
          </Link>
          <button onClick={handleDelete} style={styles.delete}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "1rem" },
  back: {
    display: "inline-block",
    marginBottom: "1rem",
    color: "#007bff",
    textDecoration: "none",
  },
  card: { border: "1px solid #ddd", borderRadius: "8px", padding: "2rem" },
  price: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#28a745",
    marginTop: "1rem",
  },
  buttons: { display: "flex", gap: "1rem", marginTop: "1rem" },
  edit: {
    background: "#ffc107",
    color: "black",
    padding: "0.5rem 1rem",
    textDecoration: "none",
    borderRadius: "4px",
  },
  delete: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loading: { textAlign: "center", padding: "2rem" },
};

export default ProductDetail;
