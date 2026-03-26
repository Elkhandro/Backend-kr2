// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const { users } = require("../data");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/roles");

const router = express.Router();

// Все маршруты пользователей доступны только администратору
router.use(authMiddleware, roleMiddleware(["admin"]));

// GET /api/users - получить всех пользователей
router.get("/", (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// GET /api/users/:id - получить пользователя по id
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PUT /api/users/:id - обновить информацию пользователя
router.put("/:id", async (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const { first_name, last_name, role, password } = req.body;

  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (role) {
    const validRoles = ["user", "seller", "admin"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ error: "Неверная роль. Допустимые: user, seller, admin" });
    }
    user.role = role;
  }
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// DELETE /api/users/:id - удалить пользователя
router.delete("/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const deletedUser = users.splice(index, 1)[0];
  const { password, ...userWithoutPassword } = deletedUser;
  res.json({ message: "Пользователь удалён", user: userWithoutPassword });
});

module.exports = router;
