jest.mock("../src/db", () => ({
  query: jest.fn(),
}));

jest.mock("../src/redis", () => ({
  redis: {
    rpush: jest.fn(),
  },
}));

jest.mock("../src/middleware/auth.middleware", () => {
  return () => (req, res, next) => {
    req.user = { id: "test-user" };
    next();
  };
});

const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");
const { redis } = require("../src/redis");

describe("Jobs Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/v1/jobs - submit job", async () => {
    db.query.mockResolvedValueOnce({});
    redis.rpush.mockResolvedValueOnce(1);

    const res = await request(app).post("/api/v1/jobs").set("Authorization", "Bearer token").send({ task: "process_data" });

    expect(res.statusCode).toBe(202);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("PENDING");
  });

  test("GET /api/v1/jobs/:id - get job", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: "1", status: "PENDING", payload: { task: "process_data" } }],
    });

    const res = await request(app).get("/api/v1/jobs/1").set("Authorization", "Bearer token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", "1");
  });
});
