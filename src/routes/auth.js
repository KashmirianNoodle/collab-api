const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const db = require("../db");

const signAccessToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const id = uuid();

  await db.query("INSERT INTO users (id,email,password_hash) VALUES ($1,$2,$3)", [id, email, hash]);

  res.status(201).json({ id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.sendStatus(401);
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = uuid();

  await db.query("INSERT INTO refresh_tokens (token,user_id) VALUES ($1,$2)", [refreshToken, user.id]);

  res.json({ accessToken, refreshToken });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  const { rows } = await db.query("SELECT user_id FROM refresh_tokens WHERE token=$1", [refreshToken]);

  if (!rows.length) return res.sendStatus(401);

  res.json({ accessToken: signAccessToken(rows[0].user_id) });
});

router.post("/logout", async (req, res) => {
  await db.query("DELETE FROM refresh_tokens WHERE token=$1", [req.body.refreshToken]);
  res.sendStatus(204);
});

module.exports = router;
