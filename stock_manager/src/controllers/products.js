const { request, response } = require("express");
const pool = require("../db/conection");
const { productsQueries } = require("../models/products");

// Función para validar la unidad de medida
const validateMeasurementUnit = (unit) => {
  const validUnits = [
    "piece",
    "meters",
    "liters",
    "square meters",
    "cubic meters",
  ];
  return validUnits.includes(unit);
};

// Mostrar todos los productos
const getAllProducts = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getAll);
    res.send(products);
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Mostrar producto por ID
const getProductsById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const product = await conn.query(productsQueries.getById, [+id]);

    if (product.length === 0) {
      res.status(404).send("Producto no encontrado");
      return;
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Crear producto
const createProducts = async (req = request, res = response) => {
  const { product, description, stock, measurement_unit, price, discount } =
    req.body;

  if (
    !product ||
    !description ||
    stock == null ||
    !measurement_unit ||
    price == null ||
    discount == null
  ) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (typeof stock !== "number" || stock < 0) {
    res.status(400).send("Stock inválido (debe ser un número positivo)");
    return;
  }

  if (!validateMeasurementUnit(measurement_unit)) {
    res.status(400).send("Unidad de medida inválida");
    return;
  }

  if (typeof price !== "number" || price <= 0) {
    res.status(400).send("Precio inválido (debe ser un número positivo)");
    return;
  }

  if (typeof discount !== "number" || discount < 0 || discount > 100) {
    res.status(400).send("Descuento inválido (debe estar entre 0 y 100)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existingProduct = await conn.query(productsQueries.getByproduct, [
      product,
    ]);
    if (existingProduct.length > 0) {
      res.status(409).send("El producto ya existe");
      return;
    }

    const newProduct = await conn.query(productsQueries.create, [
      product,
      description,
      stock,
      measurement_unit,
      price,
      discount,
    ]);

    if (newProduct.affectedRows === 0) {
      res.status(500).send("El producto no se pudo agregar");
      return;
    }

    res.status(201).send("Producto creado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar producto
const updateProducts = async (req = request, res = response) => {
  const { id } = req.params;
  const { product, description, stock, measurement_unit, price, discount } =
    req.body;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  if (
    !product ||
    !description ||
    stock == null ||
    !measurement_unit ||
    price == null ||
    discount == null
  ) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (typeof stock !== "number" || stock < 0) {
    res.status(400).send("Stock inválido (debe ser un número positivo)");
    return;
  }

  if (!validateMeasurementUnit(measurement_unit)) {
    res.status(400).send("Unidad de medida inválida");
    return;
  }

  if (typeof price !== "number" || price <= 0) {
    res.status(400).send("Precio inválido (debe ser un número positivo)");
    return;
  }

  if (typeof discount !== "number" || discount < 0 || discount > 100) {
    res.status(400).send("Descuento inválido (debe estar entre 0 y 100)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existingProduct = await conn.query(productsQueries.getById, [+id]);
    if (existingProduct.length === 0) {
      res.status(404).send("Producto no encontrado");
      return;
    }

    const duplicateProduct = await conn.query(productsQueries.getByproduct, [
      product,
    ]);
    if (duplicateProduct.length > 0 && duplicateProduct[0].id !== +id) {
      res
        .status(409)
        .send("El nombre del producto ya está en uso por otro producto");
      return;
    }

    const updatedProduct = await conn.query(productsQueries.update, [
      product,
      description,
      stock,
      measurement_unit,
      price,
      discount,
      +id,
    ]);

    if (updatedProduct.affectedRows === 0) {
      res.status(500).send("El producto no se pudo actualizar");
      return;
    }

    res.status(200).send("Producto actualizado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar producto
const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const product = await conn.query(productsQueries.getById, [+id]);
    if (product.length === 0) {
      res.status(404).send("Producto no encontrado");
      return;
    }

    const deletedProduct = await conn.query(productsQueries.delete, [+id]);
    if (deletedProduct.affectedRows === 0) {
      res.status(500).send("El producto no se pudo eliminar");
      return;
    }

    res.send("Producto eliminado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Exportar métodos
module.exports = {
  getAllProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProduct,
};
