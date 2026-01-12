import { Router } from "express";
import {
  listOperatorQueues,
  serveNextToken,
  skipCurrentToken,
  recallCurrentToken,
  pauseQueue,
  resumeQueue,
} from "./operator.controller.js";
import { verifyJWT, authorize } from "../../middlewares/auth.js";

const router = Router();

// List queues for the operator/admin
router.get("/queues", verifyJWT, authorize("operator", "admin"), listOperatorQueues);

// Serve next token
router.post(
  "/queues/:queueId/serve-next",
  verifyJWT,
  authorize("operator", "admin"),
  serveNextToken,
);

// Skip current token
router.post("/queues/:queueId/skip", verifyJWT, authorize("operator", "admin"), skipCurrentToken);

// Recall current token
router.post(
  "/queues/:queueId/recall",
  verifyJWT,
  authorize("operator", "admin"),
  recallCurrentToken,
);

// Pause queue
router.patch("/queues/:queueId/pause", verifyJWT, authorize("operator", "admin"), pauseQueue);

// Resume queue
router.patch("/queues/:queueId/resume", verifyJWT, authorize("operator", "admin"), resumeQueue);

export default router;
