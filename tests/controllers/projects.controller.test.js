jest.mock("../../src/db", () => ({
  query: jest.fn(),
}));

const db = require("../../src/db");
const mockRes = require("../utils/mockRes");
const { createProject, updateProject, deleteProject, getProject } = require("../../src/controllers/projects.controller");

describe("Projects Controller", () => {
  beforeEach(jest.clearAllMocks);

  test("createProject → success", async () => {
    const req = {
      body: { name: "Test" },
      user: { id: "123" },
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});
    db.query.mockResolvedValueOnce({});

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: expect.any(String) });
  });

  test("updateProject → success", async () => {
    const req = {
      params: { projectId: "1" },
      body: { name: "Updated" },
    };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});

    await updateProject(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test("deleteProject → success", async () => {
    const req = { params: { projectId: "1" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({});

    await deleteProject(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test("getProject → found", async () => {
    const req = { params: { projectId: "1" } };
    const res = mockRes();

    db.query.mockResolvedValueOnce({ rows: [{ id: "1" }] });

    await getProject(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: "1" });
  });
});
