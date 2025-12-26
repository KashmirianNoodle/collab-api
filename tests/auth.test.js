jest.mock("../src/db", () => ({
  query: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-access-token"),
}));

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(() => "hashed"),
  compareSync: jest.fn(() => true),
}));

const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/v1/auth/register - success", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("POST /api/v1/auth/login - success", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: "123", password_hash: "hashed" }],
    });

    db.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  test("POST /api/v1/auth/refresh - success", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ user_id: "123" }],
    });

    const res = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: "token" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("POST /api/v1/auth/logout - success", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .send({ refreshToken: "token" });

    expect(res.statusCode).toBe(204);
  });
});
