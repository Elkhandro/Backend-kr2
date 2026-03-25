import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          Товары
        </Link>
        <div style={styles.links}>
          {isAuthenticated ? (
            <>
              <Link to="/products" style={styles.link}>
                Все товары
              </Link>
              <Link to="/products/create" style={styles.link}>
                Создать товар
              </Link>
              <span style={styles.user}>
                {user?.first_name} {user?.last_name}
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
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
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#333",
    padding: "1rem",
    marginBottom: "2rem",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  user: {
    color: "#ddd",
    marginLeft: "1rem",
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "1rem",
  },
};

export default Navbar;
