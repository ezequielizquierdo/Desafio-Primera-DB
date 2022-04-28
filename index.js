// Importo express
const express = require("express");

// Importo los routers construidos
const productosRouter = require("./router/productos");
const apiRouter = require("./router/api");

// // Declaro el puerto
const PORT = 8081;
// Descargo el modulo y lo importo
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const adminRouter = require('./router/adminRouter')

// // Instancio app express
const app = express();
const httpServer = new HttpServer(app);

// // Lo que tengo en httpServer lo envio a una instancia de io server (servidor socket)
const io = new IOServer(httpServer);

// Levanto el server
// const server = app.listen(PORT, () => {
//   console.log("servidor levantado en el puerto " + server.address().port);
// });

// Levanto el servidor socket
const server = httpServer.listen(8081, () =>
  console.log("servidor Levantado en:", PORT)
);

// Envio la vista
app.use(express.static("./public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.sendFile("index.html");
  res.render("index.html");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", apiRouter);
app.use("/productos", productosRouter);
app.use("/admin", adminRouter);

const Mensajes = require('./models/Mensajes');
const messages = new Mensajes;


// const messages = [];

// Es el metodo que me define la logica de la conexión.
// El evento para levantar la conexión es el evento "connection".
io.on("connection", (socket) => {
  console.log("se conecto un usuario");
  let contenido = messages.leerMensajes();
  // Con el metodo socket.emit procedo a enviarles todos los mensajes que haya acumulados hasta el momento
  socket.emit("messages", contenido);
  socket.on("notificacion", (data) => {
    console.log(data);
  });
  // Con el socket.on recibo los mensajes
  socket.on("new-message", (data) => {
    messages.guardarMensajes(data);
    io.sockets.emit("messages", messages.leerMensajes());
  });
});

server.on("error", (error) => console.log(`hubo un error ${error}`));
