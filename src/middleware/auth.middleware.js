const jwt = require('jsonwebtoken')
const db = require('../db')

module.exports = (allowedRoles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.sendStatus(401)

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload

    if (allowedRoles.length && req.params.projectId) {
      const { rows } = await db.query(
        `SELECT role FROM project_members
         WHERE project_id=$1 AND user_id=$2`,
        [req.params.projectId, payload.id]
      )

      if (!rows.length || !allowedRoles.includes(rows[0].role)) {
        return res.sendStatus(403)
      }
    }

    next()
  } catch {
    res.sendStatus(401)
  }
}
