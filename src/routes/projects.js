const router = require('express').Router()
const { v4: uuid } = require('uuid')
const auth = require('../middleware/auth')
const db = require('../db')

router.post('/', auth(), async (req, res) => {
  const id = uuid()

  await db.query(
    'INSERT INTO projects (id,name,owner_id) VALUES ($1,$2,$3)',
    [id, req.body.name, req.user.id]
  )

  await db.query(
    'INSERT INTO project_members VALUES ($1,$2,$3)',
    [id, req.user.id, 'OWNER']
  )

  res.status(201).json({ id })
})

router.put('/:projectId', auth(['OWNER']), async (req, res) => {
  await db.query(
    'UPDATE projects SET name=$1 WHERE id=$2',
    [req.body.name, req.params.projectId]
  )
  res.sendStatus(204)
})

router.delete('/:projectId', auth(['OWNER']), async (req, res) => {
  await db.query(
    'DELETE FROM projects WHERE id=$1',
    [req.params.projectId]
  )
  res.sendStatus(204)
})

router.get('/:projectId', auth(), async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM projects WHERE id=$1',
    [req.params.projectId]
  )
  if (!rows.length) return res.sendStatus(404)
  res.json(rows[0])
})

// invite user
router.post('/:projectId/invite', auth(['OWNER']), async (req, res) => {
  const { userId, role } = req.body

  await db.query(
    `INSERT INTO project_members (project_id,user_id,role)
     VALUES ($1,$2,$3)
     ON CONFLICT DO NOTHING`,
    [req.params.projectId, userId, role || 'VIEWER']
  )

  res.sendStatus(201)
})

// update role
router.put('/:projectId/users/:userId/role', auth(['OWNER']), async (req, res) => {
  await db.query(
    `UPDATE project_members
     SET role=$1
     WHERE project_id=$2 AND user_id=$3`,
    [req.body.role, req.params.projectId, req.params.userId]
  )
  res.sendStatus(204)
})


module.exports = router
