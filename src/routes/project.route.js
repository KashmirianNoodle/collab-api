const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const projectsController = require("../controllers/projects.controller");

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management and collaboration
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the project
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Project ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", auth(), projectsController.createProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Update project name
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the project
 *     responses:
 *       204:
 *         description: Project updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 owner_id:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put("/:projectId", auth(["OWNER"]), projectsController.updateProject);

router.delete("/:projectId", auth(["OWNER"]), projectsController.deleteProject);

router.get("/:projectId", auth(), projectsController.getProject);

/**
 * @swagger
 * /projects/{projectId}/invite:
 *   post:
 *     summary: Invite a user to a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, COLLABORATOR, VIEWER]
 *     responses:
 *       201:
 *         description: User invited
 *       401:
 *         description: Unauthorized
 */
router.post("/:projectId/invite", auth(["OWNER"]), projectsController.inviteUser);

/**
 * @swagger
 * /projects/{projectId}/users/{userId}/role:
 *   put:
 *     summary: Update a user's role in a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [OWNER, COLLABORATOR, VIEWER]
 *                 description: New role for the user
 *     responses:
 *       204:
 *         description: User role updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.put("/:projectId/users/:userId/role", auth(["OWNER"]), projectsController.updateUserRole);

module.exports = router;
