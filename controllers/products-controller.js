const fs = require("fs");
const { mariaDB } = require("../database/mariaDB");
const knex = require("knex")(mariaDB);

const writeData = (producto) => {
  try {
    // const adding = fs.writeFileSync(file, JSON.stringify(data, null, 2));
    // console.log("adding", adding)
    const respuesta = knex('productos')
    .insert(producto)
    .then(() => {
      console.log('data created')
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
    .finally(() => {
      knex.destroy()
    })
    
    return respuesta
  } catch (error) {
    console.log("ERROR DE ESCRITURA", error);
  }
};

const buscarId = async (id) => {
  // const respuesta = await fs.promises.readFile(file, "utf-8");
  // const data = await JSON.parse(respuesta, null, 2);
  // const isArray = respuesta.some((item) => item.id == id);
  try {
    const respuesta = await knex
      .from("productos")
      .select("*")
      .where("id", "=", id);
    return respuesta
  } catch (error) {
    console.log("No se encontró el producto con ese id", error);
  }
  
  // if (isArray) {
  //   const itemFound = respuesta.find((item) => item.id == id);
  //   return itemFound;
  // }
  // return null;
};

const getData = async () => {
  try {
    // const respuesta = await fs.promises.readFile(file, "utf-8");
    // const data = await JSON.parse(respuesta, null, 2);
    // console.log(data)
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

module.exports = { getData, estaProducto, buscarId, writeData, clearProductos };
