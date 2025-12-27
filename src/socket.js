const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { pubClient, subClient, createAdapter } = require("./redis");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Redis adapter (horizontal scaling)
  io.adapter(createAdapter(pubClient, subClient));

  // Auth middleware
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
    console.log("Connected:", socket.userId);

    /**
     * Join project (high-level room)
     */
    socket.on("project:join", async ({ projectId }) => {
      socket.join(`project:${projectId}`);

      await pubClient.sadd(`project:${projectId}:users`, socket.userId);

      socket.to(`project:${projectId}`).emit("presence:update", {
        userId: socket.userId,
        status: "online",
      });
    });

    /**
     * Join workspace (editor-level room)
     */
    socket.on("workspace:join", async ({ workspaceId }) => {
      socket.join(`workspace:${workspaceId}`);

      await pubClient.sadd(`workspace:${workspaceId}:users`, socket.userId);

      socket.to(`workspace:${workspaceId}`).emit("presence:update", {
        userId: socket.userId,
        status: "online",
      });
    });

    /**
     * File edits (OT / CRDT ready)
     */
    socket.on("editor:update", ({ workspaceId, fileId, delta }) => {
      socket.to(`workspace:${workspaceId}`).emit("editor:update", {
        userId: socket.userId,
        fileId,
        delta,
      });
    });

    /**
     * Cursor movement
     */
    socket.on("cursor:update", ({ workspaceId, cursor }) => {
      socket.to(`workspace:${workspaceId}`).emit("cursor:update", {
        userId: socket.userId,
        cursor,
      });
    });

    /**
     * Activity feed (join, save, run, etc.)
     */
    socket.on("activity", ({ projectId, action, meta }) => {
      socket.to(`project:${projectId}`).emit("activity", {
        userId: socket.userId,
        action,
        meta,
        at: Date.now(),
      });
    });

    /**
     * Leave workspace
     */
    socket.on("workspace:leave", async ({ workspaceId }) => {
      socket.leave(`workspace:${workspaceId}`);
      await pubClient.srem(`workspace:${workspaceId}:users`, socket.userId);

      socket.to(`workspace:${workspaceId}`).emit("presence:update", {
        userId: socket.userId,
        status: "offline",
      });
    });

    /**
     * Disconnect cleanup
     */
    socket.on("disconnecting", async () => {
      for (const room of socket.rooms) {
        if (room.startsWith("workspace:")) {
          await pubClient.srem(`${room}:users`, socket.userId);
          socket.to(room).emit("presence:update", {
            userId: socket.userId,
            status: "offline",
          });
        }
      }
    });
  });

  return io;
}

module.exports = { initSocket };
