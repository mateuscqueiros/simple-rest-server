const express = require("express");
const jsonServer = require("json-server");
const dotenv = require("dotenv");
const auth = require("json-server-auth");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const server = express();
dotenv.config({ path: "./.env" });
const router = jsonServer.router("db.json");

server.use(cors());

server.get("/users/me", auth, (req, res) => {
  const authorization = req.header("Authorization");

  if (!authorization) {
    res.statusCode = 401;
    return res.json("User not authenticated");
  }

  const token = authorization.replace("Bearer ", "");
  let data;

  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.statusCode = 401;
    return res.json("JWT expired");
  }

  try {
    const { db } = req.app;
    let user = db.get("users").find({ email: data.email }).value();
    const { password, ...rest } = user;
    res.json(rest);
  } catch (error) {
    console.log(error.message);
    res.statusCode = 500;
    return res.json("Error while processing user data");
  }
});

const rules = auth.rewriter({
  users: 600,
  transactions: 640,
});

server.db = router.db;

server.use(rules);
server.use(auth);
server.use(router);

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Server running on port", port);
});
