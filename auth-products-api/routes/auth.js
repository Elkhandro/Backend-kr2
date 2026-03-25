const express = require("express");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const { users } = require("../data");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Иванов
 *               password:
 *                 type: string
 *                 example: mySecurePass123
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Не указаны обязательные поля или пользователь уже существует
 */
router.post("/register", async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({
      error: "Все поля обязательны: email, first_name, last_name, password",
    });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Пользователь с таким email уже существует" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: nanoid(),
    email,
    first_name,
    last_name,
    password: hashedPassword,
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mySecurePass123
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Неверные учётные данные
 *       404:
 *         description: Пользователь не найден
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Неверный пароль" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res
    .status(200)
    .json({ message: "Вход выполнен успешно", user: userWithoutPassword });
});

module.exports = router;
