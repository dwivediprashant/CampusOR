import { Queue, IQueue } from "../queue/queue.model.js";
import { JwtUserPayload } from "../../middlewares/auth.js";

export interface QueueAccessResult {
  queue: IQueue | null;
  error?: {
    status: number;
    message: string;
  };
}

/**
 * Ensure the requesting user is allowed to access/control a queue.
 * Admins can access all queues. Operators can only access queues they own.
 */
export async function ensureQueueAccess(
  queueId: string,
  user?: JwtUserPayload,
): Promise<QueueAccessResult> {
  if (!user) {
    return { queue: null, error: { status: 401, message: "Authentication required" } };
  }

  const queue = await Queue.findById(queueId);

  if (!queue) {
    return { queue: null, error: { status: 404, message: "Queue not found" } };
  }

  const isAdmin = user.role === "admin";
  const isOwner = queue.operator?.toString() === user.sub;

  if (!isAdmin && !isOwner) {
    return {
      queue: null,
      error: { status: 403, message: "You are not authorized to access this queue" },
    };
  }

  return { queue };
}
