// data/db.js
const users = [
  {
    id: "admin-1",
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "Adminov",
    password: "$2b$10$T0OZify9dG6M5uvPT3gTdOhkN8fLAZ7KiqRzTzXamSqi3V69kky9O", // хеш
    role: "admin",
  },
];
const products = [];
const refreshTokens = new Set();

module.exports = { users, products, refreshTokens };
