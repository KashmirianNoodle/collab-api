require("dotenv").config();
const Redis = require("ioredis");

const { createAdapter } = require("@socket.io/redis-adapter");

const pubClient = new Redis(process.env.REDIS_URL);
const subClient = pubClient.duplicate();

const redis = new Redis(process.env.REDIS_URL);

module.exports = { pubClient, subClient, createAdapter, redis };
