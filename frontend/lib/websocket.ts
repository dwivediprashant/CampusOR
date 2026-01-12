import { io, Socket } from "socket.io-client";

type UpdateQueuePayload = {
  queue: {
    id: string;
    name: string;
    location: string;
    status: "ACTIVE" | "PAUSED";
    nextSequence: number;
  };
  queueId: string;
  tokens: Array<{
    id: string;
    seq: number;
    status: string;
    createdAt: string;
  }>;
  stats: {
    totalWaiting: number;
    totalActive: number;
    totalCompleted: number;
  };
};

type SubscribeHandlers = {
  onUpdate?: (snapshot: UpdateQueuePayload) => void;
  onError?: (error: { message: string }) => void;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

let socket: Socket | null = null;
const subscribedQueues = new Set<string>();

function getSocket(): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    // Re-subscribe to all rooms after reconnect
    subscribedQueues.forEach((queueId) => {
      socket?.emit("subscribeQueue", { queueId });
    });
  });

  return socket;
}

export function subscribeToQueue(queueId: string, handlers: SubscribeHandlers) {
  const client = getSocket();
  const { onUpdate, onError } = handlers;

  const handleUpdate = (payload: UpdateQueuePayload) => {
    if (payload.queueId !== queueId) return;
    onUpdate?.(payload);
  };
  const handleError = (err: { message: string }) => onError?.(err);

  client.on("updateQueue", handleUpdate);
  client.on("error", handleError);

  subscribedQueues.add(queueId);
  client.emit("subscribeQueue", { queueId });

  return () => {
    subscribedQueues.delete(queueId);
    client.emit("unsubscribeQueue", { queueId });
    client.off("updateQueue", handleUpdate);
    client.off("error", handleError);
  };
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
  subscribedQueues.clear();
}
