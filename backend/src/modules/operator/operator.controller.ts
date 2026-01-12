import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.js";
import { OperatorService } from "./operator.service.js";
import { ensureQueueAccess } from "./operator.utils.js";
import { Queue } from "../queue/queue.model.js";
import { broadcastQueueUpdate } from "../../server/socket.js";

// List queues for the operator (admin sees all)
export async function listOperatorQueues(req: AuthRequest, res: Response) {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const filter = user.role === "admin" ? {} : { operator: user.sub };
    const queues = await Queue.find(filter).select("name location isActive");

    return res.status(200).json(
      queues.map((queue) => ({
        id: queue._id.toString(),
        name: queue.name,
        status: queue.isActive ? "ACTIVE" : "PAUSED",
        location: queue.location,
      })),
    );
  } catch (error) {
    console.error("Failed to list operator queues", error);
    return res.status(500).json({ success: false, error: "Failed to list queues" });
  }
}

// Serve next token in queue
export async function serveNextToken(req: AuthRequest, res: Response) {
  const { queueId } = req.params;

  const { error } = await ensureQueueAccess(queueId, req.user);
  if (error) return res.status(error.status).json({ success: false, error: error.message });

  const result = await OperatorService.serveNextToken(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  await broadcastQueueUpdate(queueId);
  return res.status(200).json(result);
}

// Skip current token
export async function skipCurrentToken(req: AuthRequest, res: Response) {
  const { queueId } = req.params;

  const { error } = await ensureQueueAccess(queueId, req.user);
  if (error) return res.status(error.status).json({ success: false, error: error.message });

  const result = await OperatorService.skipCurrentToken(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  await broadcastQueueUpdate(queueId);
  return res.status(200).json(result);
}

// Recall current token
export async function recallCurrentToken(req: AuthRequest, res: Response) {
  const { queueId } = req.params;

  const { error } = await ensureQueueAccess(queueId, req.user);
  if (error) return res.status(error.status).json({ success: false, error: error.message });

  const result = await OperatorService.recallCurrentToken(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  await broadcastQueueUpdate(queueId);
  return res.status(200).json(result);
}

// Pause queue
export async function pauseQueue(req: AuthRequest, res: Response) {
  const { queueId } = req.params;

  const { error } = await ensureQueueAccess(queueId, req.user);
  if (error) return res.status(error.status).json({ success: false, error: error.message });

  const result = await OperatorService.pauseQueue(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  await broadcastQueueUpdate(queueId);
  return res.status(200).json(result);
}

// Resume queue
export async function resumeQueue(req: AuthRequest, res: Response) {
  const { queueId } = req.params;

  const { error } = await ensureQueueAccess(queueId, req.user);
  if (error) return res.status(error.status).json({ success: false, error: error.message });

  const result = await OperatorService.resumeQueue(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  await broadcastQueueUpdate(queueId);
  return res.status(200).json(result);
}
