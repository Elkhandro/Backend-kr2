const express = require("express");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const { users } = require("../data");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const refreshTokens = new Set();

//Генерация access-токена
function generateAccessToken(user) {
  const ACCESS_SECRET = (req) => req.app.get("ACCESS_SECRET");
  const ACCESS_EXPIRES_IN = (req) => req.app.get("ACCESS_EXPIRES_IN");

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    },
  );
}

//Генерация refresh-токена
function generateRefreshToken(user) {
  const REFRESH_SECRET = (req) => req.app.get("REFRESH_SECRET");
  const REFRESH_EXPIRES_IN = (req) => req.app.get("REFRESH_EXPIRES_IN");

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    },
  );
}

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
    role: "user",
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
 *         description: Успешный вход, возвращает accessToken и refreshToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
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

  // Получаем секреты из настроек приложения
  const ACCESS_SECRET = req.app.get("ACCESS_SECRET");
  const REFRESH_SECRET = req.app.get("REFRESH_SECRET");
  const ACCESS_EXPIRES_IN = req.app.get("ACCESS_EXPIRES_IN");
  const REFRESH_EXPIRES_IN = req.app.get("REFRESH_EXPIRES_IN");

  // Создаём access-токен
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    },
  );

  // Создаём refresh-токен
  const refreshToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    },
  );

  // Сохраняем refresh-токен в хранилище
  refreshTokens.add(refreshToken);

  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление токенов
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Отсутствует refreshToken
 *       401:
 *         description: Неверный или истёкший refresh-токен
 */
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  // Проверяем, существует ли токен в хранилище
  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: "Неверный refresh-токен" });
  }

  try {
    const REFRESH_SECRET = req.app.get("REFRESH_SECRET");
    const ACCESS_SECRET = req.app.get("ACCESS_SECRET");
    const ACCESS_EXPIRES_IN = req.app.get("ACCESS_EXPIRES_IN");
    const REFRESH_EXPIRES_IN = req.app.get("REFRESH_EXPIRES_IN");

    // Проверяем refresh-токен
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);

    // Находим пользователя
    const user = users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    // Удаляем старый refresh-токен (ротация)
    refreshTokens.delete(refreshToken);

    // Создаём новую пару токенов
    const newAccessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      ACCESS_SECRET,
      {
        expiresIn: ACCESS_EXPIRES_IN,
      },
    );

    const newRefreshToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      REFRESH_SECRET,
      {
        expiresIn: REFRESH_EXPIRES_IN,
      },
    );

    // Сохраняем новый refresh-токен
    refreshTokens.add(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Если токен истёк, удаляем его из хранилища
      refreshTokens.delete(refreshToken);
      return res.status(401).json({
        error: "Refresh-токен истёк, требуется повторная аутентификация",
      });
    }
    return res.status(401).json({ error: "Неверный refresh-токен" });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       401:
 *         description: Не авторизован
 */
router.get("/me", authMiddleware, (req, res) => {
  const userId = req.user.sub;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход из системы (инвалидация refresh-токена)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный выход
 *       400:
 *         description: Отсутствует refreshToken
 */
router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  // Удаляем refresh-токен из хранилища
  refreshTokens.delete(refreshToken);

  res.status(200).json({ message: "Выход выполнен успешно" });
});

module.exports = router;
