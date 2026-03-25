import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axios";
import ProductForm from "../components/ProductForm";

const ProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await apiClient.put(`/products/${id}`, formData);
      navigate(`/products/${id}`);
    } catch (err) {
      alert("Ошибка обновления товара");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <Link to={`/products/${id}`} style={styles.backBtn}>
        ← Назад
      </Link>
      <h2>Редактировать товар</h2>
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        submitText="Сохранить изменения"
        loading={saving}
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

export default ProductEdit;
