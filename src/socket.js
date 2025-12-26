const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { pubClient, subClient, createAdapter } = require("./redis");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Redis adapter for multi-instance scaling
  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // join project room
    socket.on("join_project", ({ projectId }) => {
      socket.join(projectId);
      io.to(projectId).emit("user_join", { userId: socket.userId });
    });

    // leave project
    socket.on("leave_project", ({ projectId }) => {
      socket.leave(projectId);
      io.to(projectId).emit("user_leave", { userId: socket.userId });
    });

    // file change
    socket.on("file_change", ({ projectId, file, content }) => {
      io.to(projectId).emit("file_change", {
        userId: socket.userId,
        file,
        content,
      });
    });

    // cursor/activity updates
    socket.on("cursor_update", ({ projectId, cursor }) => {
      io.to(projectId).emit("cursor_update", {
        userId: socket.userId,
        cursor,
      });
    });

    socket.on("activity", ({ projectId, action }) => {
      io.to(projectId).emit("activity", {
        userId: socket.userId,
        action,
      });
    });

    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      rooms.forEach((room) => {
        io.to(room).emit("user_leave", { userId: socket.userId });
      });
    });
  });

  return io;
}

module.exports = { initSocket };
