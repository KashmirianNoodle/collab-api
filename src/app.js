const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const logEndpoints = require("./util/logEndpoint.util");
const setupSwagger = require("../src/swagger");

const authRoutes = require("./routes/auth.route");
const projectRoutes = require("./routes/project.route");
const workspaceRoutes = require("./routes/workspace.route");
const jobRoutes = require("./routes/jobs.route");

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60000, max: 100 }));

app.use(logEndpoints);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/jobs", jobRoutes);

setupSwagger(app);

module.exports = app;
