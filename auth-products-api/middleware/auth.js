// middleware/auth.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({
        error:
          "Отсутствует или неверный формат Authorization header. Используйте: Bearer <token>",
      });
  }

  try {
    const ACCESS_SECRET = req.app.get("ACCESS_SECRET");
    const payload = jwt.verify(token, ACCESS_SECRET);

    // Сохраняем данные пользователя, включая роль
    req.user = {
      id: payload.sub,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      role: payload.role || "user", // если роль не указана, по умолчанию user
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          error: "Access-токен истёк, используйте refresh-токен для обновления",
        });
    }
    return res.status(401).json({ error: "Неверный access-токен" });
  }
}

module.exports = authMiddleware;
