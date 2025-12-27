const { v4: uuid } = require("uuid");
const db = require("../db");

/**
 * Create a new project
 */
async function createProject(req, res) {
  try {
    const id = uuid();

    await db.query("INSERT INTO projects (id,name,owner_id) VALUES ($1,$2,$3)", [id, req.body.name, req.user.id]);

    await db.query("INSERT INTO project_members VALUES ($1,$2,$3)", [id, req.user.id, "OWNER"]);

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Update project name
 */
async function updateProject(req, res) {
  try {
    await db.query("UPDATE projects SET name=$1 WHERE id=$2", [req.body.name, req.params.projectId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Delete a project
 */
async function deleteProject(req, res) {
  try {
    await db.query("DELETE FROM projects WHERE id=$1", [req.params.projectId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get project by ID
 */
async function getProject(req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM projects WHERE id=$1", [req.params.projectId]);
    if (!rows.length) return res.sendStatus(404);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Invite a user to project
 */
async function inviteUser(req, res) {
  try {
    const { userId, role } = req.body;

    await db.query(
      `INSERT INTO project_members (project_id,user_id,role)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING`,
      [req.params.projectId, userId, role || "VIEWER"]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * List Projects
 */
async function listProjects(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT p.*
       FROM projects p
       JOIN project_members pm ON pm.project_id = p.id
       WHERE pm.user_id = $1`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * List Project members
 */
async function listProjectMembers(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.email, pm.role
       FROM project_members pm
       JOIN users u ON u.id = pm.user_id
       WHERE pm.project_id = $1`,
      [req.params.projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}


/**
 * Update a user's role
 */
async function updateUserRole(req, res) {
  try {
    await db.query(
      `UPDATE project_members
       SET role=$1
       WHERE project_id=$2 AND user_id=$3`,
      [req.body.role, req.params.projectId, req.params.userId]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  listProjects,
  listProjectMembers,
  inviteUser,
  updateUserRole,
};
