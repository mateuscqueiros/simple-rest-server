const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require("cors");

require("dotenv").config();

server.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);
server.options("*", cors());

server.use(middlewares);
server.use(router);
server.listen(process.env.PORT, () => {
  console.log("JSON Server is running");
});
