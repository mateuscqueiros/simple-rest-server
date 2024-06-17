var express = require("express");
var jsonServer = require("json-server");
var dotenv = require("dotenv");
var auth = require("json-server-auth");
var cors = require("cors");

var server = express();
server.use(cors());

dotenv.config({ path: "./.env" });
var router = jsonServer.router("db.json");

server.db = router.db;

server.use(auth);
server.use(router);

var port = process.env.PORT;

server.listen(port, () => {
  console.log("Server running on port", port);
});
