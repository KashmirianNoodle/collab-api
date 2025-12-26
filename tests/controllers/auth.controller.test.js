jest.mock("../../src/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(() => "hashed"),
  compareSync: jest.fn(() => true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "access-token"),
}));

const db = require("../../src/db");
const mockRes = require("../utils/mockRes");
const { register, login, refresh, logout } = require("../../src/controllers/auth.controller");

describe("Auth Controller", () => {
  beforeEach(jest.clearAllMocks);

  test("register → success", async () => {
    const req = {
      body: { email: "a@test.com", password: "123" },
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
  });

  test("login → success", async () => {
    const req = {
      body: { email: "a@test.com", password: "123" },
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({ rows: [{ id: "1", password_hash: "hashed" }] }).mockResolvedValueOnce({});

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: expect.any(String),
    });
  });

  test("refresh → success", async () => {
    const req = { body: { refreshToken: "token" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({ rows: [{ user_id: "1" }] });

    await refresh(req, res);

    expect(res.json).toHaveBeenCalledWith({ accessToken: "access-token" });
  });

  test("logout → success", async () => {
    const req = { body: { refreshToken: "token" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});

    await logout(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});
