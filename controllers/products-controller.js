const fs = require("fs");
const { mariaDB } = require("../database/mariaDB");
const knex = require("knex")(mariaDB);

const writeData = (producto) => {
  try {
    const respuesta = knex("productos")
      .insert(producto)
      .then(() => {
        console.log("data created");
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return respuesta;
  } catch (error) {
    console.log("ERROR DE ESCRITURA", error);
  }
};

const updateData = (productoId, productos) => {
  try {
    const respuesta = knex
      .from("productos")
      .where("id", "=", productoId)
      .update(productos)
      .then(() => {
        console.log("Tabla actualizada");
      })
      .catch((err) => {
        console.log(err);
      });
    return respuesta;
  } catch (error) {
    console.log("Errorazo");
  }
};

const borrarId = async (productoId) => {
  try {
    let response = await knex
      .from("productos")
      .where("id", "=", productoId)
      .del();
    return response;
  } catch (error) {
    console.log(error);
  }
};

const buscarId = async (id) => {
  try {
    const respuesta = await knex
      .from("productos")
      .select("*")
      .where("id", "=", id);
    console.log("respuesta", respuesta);
    return respuesta
  } catch (error) {
    console.log("No se encontró el producto con ese id", error);
  }
};

const getData = async () => {
  try {
    const respuesta = await knex.from("productos").select("*");
    return respuesta;
  } catch (error) {
    console.log("Error de Lectura", error);
  }
};

const estaProducto = (id, array) => {
  return array.filter((producto) => producto.id === id);
};

const clearProductos = () => {
  console.log("Hizo click");
  // return productos = []
};

module.exports = {
  getData,
  estaProducto,
  buscarId,
  writeData,
  clearProductos,
  updateData,
  borrarId,
};
