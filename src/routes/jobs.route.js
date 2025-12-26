const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const jobsController = require("../controllers/jobs.controller");

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Asynchronous job processing
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Submit a new asynchronous job
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Payload of the job to be processed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               task: "process_data"
 *               data: { "input": "example" }
 *     responses:
 *       202:
 *         description: Job accepted and queued for processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique job ID
 *                 status:
 *                   type: string
 *                   description: Initial status of the job
 *                   example: PENDING
 *       401:
 *         description: Unauthorized, JWT missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post("/", auth(), jobsController.createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get the status and result of a specific job
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the job
 *     responses:
 *       200:
 *         description: Job found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   description: Current status of the job
 *                   example: PENDING
 *                 payload:
 *                   type: object
 *                   description: Original job payload
 *       401:
 *         description: Unauthorized, JWT missing or invalid
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", auth(), jobsController.getJob);

module.exports = router;
