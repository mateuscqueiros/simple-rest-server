require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const db = require("./db");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Não autorizado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
};

// Registro
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      res.status(201).json({ message: "Usuário registrado com sucesso" });
    },
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS em produção
      sameSite: "Strict",
    });
    res.json({ message: "Login bem-sucedido" });
  });
});

// Rota Protegida
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}` });
});

app.get("/user", authenticateToken, (req, res) => {
  res.json(req.user);
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout bem-sucedido" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
