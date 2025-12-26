const router = require('express').Router()
const { v4: uuid } = require('uuid')
const auth = require('../middleware/auth')
const db = require('../db')

router.post('/', auth(['OWNER','COLLABORATOR']), async (req, res) => {
  const id = uuid()
  await db.query(
    'INSERT INTO workspaces (id,project_id,name) VALUES ($1,$2,$3)',
    [id, req.body.projectId, req.body.name]
  )
  res.status(201).json({ id })
})

router.get('/:id', auth(), async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM workspaces WHERE id=$1',
    [req.params.id]
  )
  if (!rows.length) return res.sendStatus(404)
  res.json(rows[0])
})

module.exports = router
