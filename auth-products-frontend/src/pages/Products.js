import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      alert("Ошибка удаления");
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <h2>Товары</h2>
      {products.length === 0 ? (
        <p>
          Нет товаров. <Link to="/products/create">Создать</Link>
        </p>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <h3>{p.title}</h3>
              <p>{p.category}</p>
              <p>{p.price} ₽</p>
              <div style={styles.buttons}>
                <Link to={`/products/${p.id}`} style={styles.view}>
                  Просмотр
                </Link>
                <Link to={`/products/${p.id}/edit`} style={styles.edit}>
                  Изменить
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={styles.delete}
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
  container: { maxWidth: "1200px", margin: "0 auto", padding: "1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  card: { border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" },
  buttons: { display: "flex", gap: "0.5rem", marginTop: "1rem" },
  view: {
    background: "#007bff",
    color: "white",
    padding: "0.3rem 0.6rem",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  edit: {
    background: "#ffc107",
    color: "black",
    padding: "0.3rem 0.6rem",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  delete: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  loading: { textAlign: "center", padding: "2rem" },
};

export default Products;
