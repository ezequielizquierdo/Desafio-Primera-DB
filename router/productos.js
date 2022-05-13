const express = require("express");
const {
  getData,
  buscarId,
  estaProducto,
  writeData,
} = require("../controllers/products-controller");

const fs = require("fs");

const productosRouter = express.Router();

//routers

productosRouter.get("/", async (req, res) => {
  try {
    const productos = await getData();
    productos !== undefined
      ? res.render("formulario", { productos })
      : res.json({ error: "producto no encontrado" });
  } catch (error) {
    return res.json({ mensaje: "no se pudo comprar" });
  }
});

// Invoco producto por id
productosRouter.get("/:num", async (req, res) => {
  let numeroId = req.params.num;
  if (isNaN(req.params.num)) {
    res.json({ error: "el parametro no es un numero" });
  } else {
    const productoBuscado = await buscarId(numeroId);
    productoBuscado !== null
      ? res.render("detalle", { productoBuscado })
      : res.json({ error: "producto no encontrado" });
    console.log("productoBuscado", productoBuscado);
  }
});

// recibe y agrega un producto, y lo devuelve con su id asignado.

productosRouter.post("/", async (req, res) => {
  let productos = await getData();
  if (
    req.body.title == null ||
    req.body.price == null ||
    req.body.thumbnail == null
  ) {
    res.json({ error: "Faltan productos por completar" });
  }
  if (req == null) {
    console.log("Formulario");
  } else {
  }
  // Si no hay productos el id será 0
  if (productos == "[]") {
    productos = 0;
  }
  // Cuento la cantidad de productos en el array productos existente y le sumo 1
  const id = productos.length + 1;

  try {
    await writeData([{ ...req.body, id: id }]);
    productos = await getData();
    return res.render("formulario", { productos });
  } catch (e) {
    console.log("No se pudo guardar el objeto " + e);
  }
});

// Actualizo un producto en un id
productosRouter.put("/:id", async (req, res) => {
  const numeroId = req.params.id;
  try {
    const productos = await getData();
    if (estaProducto(numeroId, productos)) {
      const indexProducto = req.params.id - 1;
      const productoCargar = { ...req.body, id: numeroId };
      const prodsplice = productos.splice(indexProducto, 1, productoCargar);

      console.log("Updated ->", prodsplice);
      return res.json(prodsplice);
    } else {
      return res.json("no esta el producto");
    }
  } catch (error) {
    console.log("no se pudo post producto nuevo " + error);
  }
});

// Este método delete borra todo en el archivo productos.txt
productosRouter.delete("/", async (req, res) => {
  try {
    let productos = await getData();
    if (productos) {
      await writeData([]);
      return res.json({ mensaje: "Se borro todo" });
    }
  } catch (err) {
    res.json({ mensaje: "No se pudo borrar todo" });
  }
});

// Este método llama al producto por su id
productosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const productoBuscado = await buscarId(id);
  console.log("Producto Elegido para borrar", productoBuscado);
  try {
    borrarId(id);
    return res.json(productoBuscado);
  } catch (err) {
    res.json(err);
  }
});

module.exports = productosRouter;
