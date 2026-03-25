const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error:
        "Отсутствует или неверный формат Authorization header. Используйте: Bearer <token>",
    });
  }

  try {
    const JWT_SECRET = req.app.get("JWT_SECRET");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload; // { sub, email, first_name, last_name, iat, exp }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Токен истёк" });
    }
    return res.status(401).json({ error: "Неверный или истёкший токен" });
  }
}

module.exports = authMiddleware;
