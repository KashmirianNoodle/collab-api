const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const workspacesController = require("../controllers/workspace.controller");

/**
 * @swagger
 * tags:
 *   name: Workspaces
 *   description: Workspace management under projects
 */

/**
 * @swagger
 * /workspaces:
 *   post:
 *     summary: Create a new workspace under a project
 *     tags: [Workspaces]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Workspace data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - name
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID of the project the workspace belongs to
 *               name:
 *                 type: string
 *                 description: Name of the workspace
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Workspace ID
 *       401:
 *         description: Unauthorized (JWT missing/invalid or insufficient role)
 *       500:
 *         description: Internal server error
 */
router.post("/", auth(["OWNER", "COLLABORATOR"]), workspacesController.createWorkspace);
/**
 * @swagger
 * /workspaces/{id}:
 *   get:
 *     summary: Get a workspace by ID
 *     tags: [Workspaces]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: Workspace details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 project_id:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized (JWT missing/invalid)
 *       404:
 *         description: Workspace not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", auth(), workspacesController.getWorkspace);

module.exports = router;
