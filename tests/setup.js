jest.mock("../src/db", () => ({
  query: jest.fn(),
}));

jest.mock("../src/redis", () => ({
  redis: {
    rpush: jest.fn(),
    publish: jest.fn(),
  },
}));

jest.mock("../src/middleware/auth.middleware", () => {
  return (roles = []) =>
    (req, res, next) => {
      req.user = {
        id: "test-user-id",
        role: "OWNER",
      };
      next();
    };
});
