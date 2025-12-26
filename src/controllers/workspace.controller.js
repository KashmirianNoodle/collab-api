const { v4: uuid } = require("uuid");
const db = require("../db");

/**
 * Create a new workspace under a project
 */
async function createWorkspace(req, res) {
  try {
    const id = uuid();
    await db.query("INSERT INTO workspaces (id, project_id, name) VALUES ($1, $2, $3)", [id, req.body.projectId, req.body.name]);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get a workspace by ID
 */
async function getWorkspace(req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM workspaces WHERE id=$1", [req.params.id]);
    if (!rows.length) return res.sendStatus(404);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createWorkspace,
  getWorkspace,
};
