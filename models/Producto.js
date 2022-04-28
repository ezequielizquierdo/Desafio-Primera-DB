const fs = require("fs");
// const data = fs.readFileSync("data/productos.json");
const products = fs.readFileSync("./productos.txt");
console.log("products", products)
const { idGenerate } = require("../helpers/id-generate");

// let products = JSON.parse(data);

class Producto {
  constructor(id, title, price, url) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.url = url;
  }

  save = (req) => {
    try {
      const { title, price, url } = req.body;
      const newProduc = new Producto();
      newProduc.id = idGenerate(products);
      newProduc.title = title;
      newProduc.price = price;
      newProduc.url = url;

      products.push(newProduc);
      // const json_products = JSON.stringify(products);
      // fs.writeFileSync("data/productos.json", json_products, "utf-8");
      fs.writeFileSync(
        __dirname + "/productos.txt",
        JSON.stringify(products, null, "\t")
      );
      return newProduc;
    } catch (error) {
      throw "Error: Product";
    }
  };

  findById = (id) => {
    const product = products.filter((product) => product.id == id);
    if (product != "") {
      return product;
    } else {
      throw "Producto no encontrado";
    }
  };

  deleteById = (id) => {
    const findId = this.findById(id);
    if (findId != "") {
      products = products.filter((product) => product.id !== id);
      // const json_products = JSON.stringify(products);
      // fs.writeFileSync("data/productos.json", json_products, "utf-8");
      fs.writeFileSync(
        __dirname + "/productos.txt",
        JSON.stringify(products, null, "\t")
      );
    } else {
      throw "No existe el ID";
    }
  };

  getAll = () => {
    return products;
  };

  remove = (id) => {
    const busqueda = this.findById(id);

    if (busqueda) {
      products = products.filter((product) => product.id != id);
      // const json_products = JSON.stringify(products);
      // fs.writeFileSync("data/productos.json", json_products, "utf-8");
      fs.writeFileSync(
        __dirname + "/productos.txt",
        JSON.stringify(products, null, "\t")
      );
    } else {
      throw "Producto no encontrado";
    }
  };

  update = async (req) => {
    const id = req.params.id;
    const { title, price, url } = req.body;
    try {
      let busqueda = products.find((el) => (el.id = id));
      if (busqueda.id === id) {
        busqueda.title = title;
        busqueda.price = price;
        busqueda.url = url;
        this.remove(id);
        products.push(busqueda);
        // const json_products = JSON.stringify(products);
        // fs.writeFileSync("data/productos.json", json_products, "utf-8");
        fs.writeFileSync(
          __dirname + "/productos.txt",
          JSON.stringify(products, null, "\t")
        );
        return busqueda;
      }
    } catch (error) {
      throw "Error server";
    }
  };

  deleteAll = () => {
    products = [];
    // const json_products = JSON.stringify(products);
    // fs.writeFileSync("data/productos.json", json_products, "utf-8");
    fs.writeFileSync(
      __dirname + "/productos.txt",
      JSON.stringify(products, null, "\t")
    );
  };
}

module.exports = {
  Producto,
};
