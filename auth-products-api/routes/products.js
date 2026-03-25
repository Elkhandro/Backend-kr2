const express = require("express");
const { nanoid } = require("nanoid");
const { products } = require("../data");

const router = express.Router();

// Вспомогательная функция для поиска товара по id
const findProductById = (id, res) => {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Товар не найден" });
    return null;
  }
  return product;
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Товар создан
 *       400:
 *         description: Не указаны обязательные поля
 */
router.post("/", (req, res) => {
  const { title, category, description, price } = req.body;

  if (!title || !category || !description || price === undefined) {
    return res.status(400).json({
      error: "Все поля обязательны: title, category, description, price",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "Price должен быть положительным числом" });
  }

  const newProduct = {
    id: nanoid(),
    title,
    category,
    description,
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 */
router.get("/", (req, res) => {
  res.status(200).json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 *       404:
 *         description: Товар не найден
 */
router.get("/:id", (req, res) => {
  const product = findProductById(req.params.id, res);
  if (product) {
    res.status(200).json(product);
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить параметры товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
router.put("/:id", (req, res) => {
  const product = findProductById(req.params.id, res);
  if (!product) return;

  const { title, category, description, price } = req.body;

  if (title !== undefined) product.title = title;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ error: "Price должен быть положительным числом" });
    }
    product.price = price;
  }

  res.status(200).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
router.delete("/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  products.splice(index, 1);
  res.status(200).json({ message: "Товар успешно удалён" });
});

module.exports = router;
