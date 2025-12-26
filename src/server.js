
require('dotenv').config()
const http = require('http')
const app = require('./app')
const { initSocket } = require('./socket')

const server = http.createServer(app)
initSocket(server)

server.listen(process.env.PORT || 4000, () => {
  console.log('Server running on port', process.env.PORT)
})
