
const { Server } = require('socket.io')

function initSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } })

  io.on('connection', socket => {
    socket.on('join', room => {
      socket.join(room)
      socket.to(room).emit('user_joined', socket.id)
    })

    socket.on('event', ({ room, data }) => {
      socket.to(room).emit('event', data)
    })

    socket.on('disconnect', () => {})
  })
}

module.exports = { initSocket }
