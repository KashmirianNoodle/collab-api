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

describe("Workspaces Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/v1/workspaces - create workspace", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app).post("/api/v1/workspaces").set("Authorization", "Bearer token").send({ projectId: "1", name: "Workspace 1" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("GET /api/v1/workspaces/:id - get workspace", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: "1", project_id: "1", name: "Workspace 1" }],
    });

    const res = await request(app).get("/api/v1/workspaces/1").set("Authorization", "Bearer token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", "1");
  });
});
