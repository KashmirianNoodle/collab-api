const router = require("express").Router();
const auth = require("../middleware/auth");
const { v4: uuid } = require("uuid");
const redis = require("../redis");
const db = require("../db");

router.post("/", auth(), async (req, res) => {
  const id = uuid();

  await db.query(
    `INSERT INTO jobs (id, status, payload)
     VALUES ($1, 'PENDING', $2)`,
    [id, req.body]
  );

  await redis.rpush("jobs", JSON.stringify({ id }));

  res.status(202).json({ id, status: "PENDING" });
});

router.get("/:id", auth(), async (req, res) => {
  const { rows } = await db.query("SELECT * FROM jobs WHERE id = $1", [req.params.id]);

  if (!rows.length) return res.sendStatus(404);
  res.json(rows[0]);
});

module.exports = router;
