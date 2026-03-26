const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// JWT конфигурация
const ACCESS_SECRET = "access_secret_key_change_in_production";
const REFRESH_SECRET = "refresh_secret_key_change_in_production";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

app.set("ACCESS_SECRET", ACCESS_SECRET);
app.set("REFRESH_SECRET", REFRESH_SECRET);
app.set("ACCESS_EXPIRES_IN", ACCESS_EXPIRES_IN);
app.set("REFRESH_EXPIRES_IN", REFRESH_EXPIRES_IN);

app.use(express.json());

// Swagger конфигурация (остаётся без изменений)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth & Products API",
      version: "1.0.0",
      description: "API для аутентификации и управления товарами",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Подключаем маршруты
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);

// Добавляем корневой маршрут
app.get("/", (req, res) => {
  res.json({
    message: "API сервер работает",
    endpoints: { docs: "/api-docs" },
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(
    `Swagger UI доступен по адресу http://localhost:${port}/api-docs`,
  );
});
