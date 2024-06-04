var express = require("express");
var jsonServer = require("json-server");
var dotenv = require("dotenv");
var auth = require("json-server-auth");
var jwt = require("jsonwebtoken");
var cors = require("cors");

var server = express();

server.use(cors());

dotenv.config({ path: "./.env" });
var router = jsonServer.router("db.json");

server.get("/users/me", auth, (req, res) => {
  var authorization = req.header("Authorization");

  if (!authorization) {
    res.statusCode = 401;
    return res.json("User not authenticated");
  }

  var token = authorization.replace("Bearer ", "");
  let data;

  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.statusCode = 401;
    return res.json("JWT expired");
  }

  try {
    var { db } = req.app;
    let user = db.get("users").find({ email: data.email }).value();
    var { password, ...rest } = user;
    res.json(rest);
  } catch (error) {
    console.log(error.message);
    res.statusCode = 500;
    return res.json("Error while processing user data");
  }
});

var rules = auth.rewriter({
  users: 600,
  transactions: 640,
});

server.db = router.db;

server.use(rules);
server.use(auth);
server.use(router);

var port = process.env.PORT;

server.listen(port, () => {
  console.log("Server running on port", port);
});
