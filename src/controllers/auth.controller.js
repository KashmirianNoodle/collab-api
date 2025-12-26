const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const db = require("../db");

const signAccessToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const id = uuid();

    await db.query("INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)", [id, email, hash]);

    res.status(201).json({ id });
  } catch (err) {
    if (err.code === "23505" && err.constraint === "users_email_key") {
      return res.status(409).json({ message: "User with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Login a user
 */
async function login(req, res) {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Refresh access token
 */
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    const { rows } = await db.query("SELECT user_id FROM refresh_tokens WHERE token=$1", [refreshToken]);
    if (!rows.length) return res.sendStatus(401);

    res.json({ accessToken: signAccessToken(rows[0].user_id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Logout a user
 */
async function logout(req, res) {
  try {
    await db.query("DELETE FROM refresh_tokens WHERE token=$1", [req.body.refreshToken]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
