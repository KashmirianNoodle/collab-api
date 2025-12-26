jest.mock("../../src/db", () => ({
  query: jest.fn(),
}));

const db = require("../../src/db");
const mockRes = require("../utils/mockRes");
const { createWorkspace, getWorkspace } = require("../../src/controllers/workspace.controller");

describe("Workspaces Controller", () => {
  beforeEach(jest.clearAllMocks);

  test("createWorkspace → success", async () => {
    const req = {
      body: { projectId: "1", name: "WS" },
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});

    await createWorkspace(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: expect.any(String) });
  });

  test("getWorkspace → found", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({
      rows: [{ id: "1", name: "WS" }],
    });

    await getWorkspace(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: "1", name: "WS" });
  });
});
