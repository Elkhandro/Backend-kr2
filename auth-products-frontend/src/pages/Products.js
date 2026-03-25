import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Ошибка удаления");
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <h2>Список товаров</h2>
      {error && <div style={styles.error}>{error}</div>}
      {products.length === 0 ? (
        <p>
          Нет товаров. <Link to="/products/create">Создайте первый товар</Link>
        </p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <h3>{product.title}</h3>
              <p style={styles.category}>{product.category}</p>
              <p>{product.description.substring(0, 100)}...</p>
              <p style={styles.price}>{product.price} ₽</p>
              <div style={styles.buttons}>
                <Link to={`/products/${product.id}`} style={styles.viewBtn}>
                  Подробнее
                </Link>
                <Link
                  to={`/products/${product.id}/edit`}
                  style={styles.editBtn}
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={styles.deleteBtn}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "white",
  },
  category: {
    color: "#666",
    fontSize: "0.9rem",
  },
  price: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#28a745",
  },
  buttons: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  viewBtn: {
    padding: "0.25rem 0.5rem",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  editBtn: {
    padding: "0.25rem 0.5rem",
    backgroundColor: "#ffc107",
    color: "black",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  deleteBtn: {
    padding: "0.25rem 0.5rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
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

export default Products;
