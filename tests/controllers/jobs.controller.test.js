jest.mock("../../src/db", () => ({
  query: jest.fn(),
}));

jest.mock("../../src/redis", () => ({
  redis: { rpush: jest.fn() },
}));

const db = require("../../src/db");
const { redis } = require("../../src/redis");
const mockRes = require("../utils/mockRes");
const { createJob, getJob } = require("../../src/controllers/jobs.controller");

describe("Jobs Controller", () => {
  beforeEach(jest.clearAllMocks);

  test("createJob → success", async () => {
    const req = { body: { task: "run" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});
    redis.rpush.mockResolvedValueOnce(1);

    await createJob(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      id: expect.any(String),
      status: "PENDING",
    });
  });

  test("getJob → found", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({
      rows: [{ id: "1", status: "PENDING" }],
    });

    await getJob(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });
});
