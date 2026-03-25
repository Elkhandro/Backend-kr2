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

    req.user = payload;
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
