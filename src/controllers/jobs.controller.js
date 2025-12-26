const { v4: uuid } = require("uuid");
const { redis } = require("../redis");
const db = require("../db");

/**
 * Submit a new asynchronous job
 */
async function createJob(req, res) {
  try {
    const id = uuid();

    await db.query(
      `INSERT INTO jobs (id, status, payload)
       VALUES ($1, 'PENDING', $2)`,
      [id, req.body]
    );

    await redis.rpush("jobs", JSON.stringify({ id }));

    res.status(202).json({ id, status: "PENDING" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get job status and result
 */
async function getJob(req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM jobs WHERE id = $1", [req.params.id]);

    if (!rows.length) return res.sendStatus(404);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createJob,
  getJob,
};
