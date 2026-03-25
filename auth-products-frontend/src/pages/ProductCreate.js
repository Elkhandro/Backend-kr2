import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axios";
import ProductForm from "../components/ProductForm";

const ProductCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/products", formData);
      navigate(`/products/${response.data.id}`);
    } catch (err) {
      alert("Ошибка создания товара");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/products" style={styles.backBtn}>
        ← Назад к списку
      </Link>
      <h2>Создать новый товар</h2>
      <ProductForm
        onSubmit={handleSubmit}
        submitText="Создать товар"
        loading={loading}
      />
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
};

export default ProductCreate;
