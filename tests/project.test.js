jest.mock("../src/db", () => ({
  query: jest.fn(),
}));

jest.mock("../src/middleware/auth.middleware", () => {
  return () => (req, res, next) => {
    req.user = { id: "123" };
    next();
  };
});

const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

describe("Projects Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/v1/projects - create project", async () => {
    db.query.mockResolvedValueOnce({});
    db.query.mockResolvedValueOnce({});

    const res = await request(app).post("/api/v1/projects").set("Authorization", "Bearer token").send({ name: "My Project" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("PUT /api/v1/projects/:projectId - update project", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app).put("/api/v1/projects/1").set("Authorization", "Bearer token").send({ name: "Updated Project" });

    expect(res.statusCode).toBe(204);
  });

  test("DELETE /api/v1/projects/:projectId", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app).delete("/api/v1/projects/1").set("Authorization", "Bearer token");

    expect(res.statusCode).toBe(204);
  });

  test("GET /api/v1/projects/:projectId", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: "1", name: "Project", owner_id: "123" }],
    });

    const res = await request(app).get("/api/v1/projects/1").set("Authorization", "Bearer token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", "1");
  });

  test("POST /api/v1/projects/:projectId/invite", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app).post("/api/v1/projects/1/invite").set("Authorization", "Bearer token").send({ userId: "456", role: "VIEWER" });

    expect(res.statusCode).toBe(201);
  });

  test("PUT /api/v1/projects/:projectId/users/:userId/role", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app).put("/api/v1/projects/1/users/456/role").set("Authorization", "Bearer token").send({ role: "COLLABORATOR" });

    expect(res.statusCode).toBe(204);
  });
});
