import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Товары
      </Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/products" style={styles.link}>
              Товары
            </Link>
            <Link to="/products/create" style={styles.link}>
              Создать
            </Link>
            <span style={styles.user}>
              {user.first_name} {user.last_name}
            </span>
            <button onClick={handleLogout} style={styles.button}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Вход
            </Link>
            <Link to="/register" style={styles.link}>
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#333",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "white", textDecoration: "none", fontSize: "1.2rem" },
  links: { display: "flex", gap: "1rem", alignItems: "center" },
  link: { color: "white", textDecoration: "none" },
  user: { color: "#ddd" },
  button: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.3rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;
