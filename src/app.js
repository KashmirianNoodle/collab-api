
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const workspaceRoutes = require('./routes/workspaces')
const jobRoutes = require('./routes/jobs')

const app = express()
app.use(cors())
app.use(express.json())
app.use(rateLimit({ windowMs: 60000, max: 100 }))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/projects', projectRoutes)
app.use('/api/v1/workspaces', workspaceRoutes)
app.use('/api/v1/jobs', jobRoutes)

module.exports = app
