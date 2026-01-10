import { apiService } from "../api";

// Feature flag to switch between mock and real API
const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" &&
  !process.env.NEXT_PUBLIC_USE_REAL_API;

// Types matching backend schema
export interface QueueHistoryItem {
  id: string;
  queueId: string;
  queueName: string;
  location: string;
  tokenNumber: string;
  joinedAt: string;
  servedAt?: string;
  cancelledAt?: string;
  status: "served" | "cancelled" | "completed";
  waitTime: number; // in minutes
  serviceTime?: number; // in minutes
}

export interface UserNotification {
  id: string;
  userId: string;
  queueId?: string;
  queueName?: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface CurrentQueue {
  id: string;
  queueId: string;
  queueName: string;
  location: string;
  tokenNumber: string;
  currentPosition: number;
  estimatedWaitTime: number; // in minutes
  joinedAt: string;
  status: "waiting" | "near" | "serving";
}

export interface UserState {
  userId: string;
  isInQueue: boolean;
  queueId?: string; // only if isInQueue is true
}

export interface UserQueueStats {
  totalQueuesJoined: number;
  averageWaitTime: number;
  totalServed: number;
  totalCancelled: number;
  thisMonthQueues: number;
}

// Mock data for development - clearly separated from real API logic
const mockHistoryData: QueueHistoryItem[] = [
  {
    id: "1",
    queueId: "q1",
    queueName: "Cafeteria Lunch Queue",
    location: "Main Cafeteria - Building A",
    tokenNumber: "C042",
    joinedAt: "2024-01-15T12:30:00Z",
    servedAt: "2024-01-15T12:45:00Z",
    status: "served",
    waitTime: 15,
    serviceTime: 8,
  },
  {
    id: "2",
    queueId: "q2",
    queueName: "Library Computer Lab",
    location: "Central Library - 2nd Floor",
    tokenNumber: "L128",
    joinedAt: "2024-01-14T14:20:00Z",
    cancelledAt: "2024-01-14T15:00:00Z",
    status: "cancelled",
    waitTime: 40,
  },
];

const mockNotifications: UserNotification[] = [
  {
    id: "1",
    userId: "user123",
    queueId: "q1",
    queueName: "Cafeteria Lunch Queue",
    title: "Your turn is coming up!",
    message:
      "You are next in line for Cafeteria Lunch Queue. Please proceed to the counter.",
    type: "info",
    isRead: false,
    createdAt: "2024-01-15T12:44:00Z",
  },
  {
    id: "2",
    userId: "user123",
    queueId: "q3",
    queueName: "Student Services",
    title: "Queue completed",
    message: "Your token has been served. Thank you for your patience.",
    type: "success",
    isRead: true,
    createdAt: "2024-01-13T10:35:00Z",
    readAt: "2024-01-13T10:36:00Z",
  },
];

const mockCurrentQueue: CurrentQueue | null = {
  id: "current1",
  queueId: "q5",
  queueName: "Health Center",
  location: "Medical Building - 1st Floor",
  tokenNumber: "H091",
  currentPosition: 3,
  estimatedWaitTime: 12,
  joinedAt: "2024-01-16T09:00:00Z",
  status: "waiting",
};

const mockStats: UserQueueStats = {
  totalQueuesJoined: 24,
  averageWaitTime: 18,
  totalServed: 20,
  totalCancelled: 4,
  thisMonthQueues: 8,
};

class UserQueueService {
  private api = apiService;

  async getQueueHistory(): Promise<{ data: QueueHistoryItem[] }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: mockHistoryData };
    }

    try {
      const response = await this.api.get("/api/user/queue-history", true);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching queue history:", error);
      throw error;
    }
  }

  async getNotifications(
    unreadOnly: boolean = false
  ): Promise<{ data: UserNotification[] }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const filteredData = unreadOnly
        ? mockNotifications.filter((n) => !n.isRead)
        : mockNotifications;
      return { data: filteredData };
    }

    try {
      const endpoint = unreadOnly
        ? "/api/user/notifications?unread=true"
        : "/api/user/notifications";
      const response = await this.api.get(endpoint, true);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const notification = mockNotifications.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
      return { success: true };
    }

    try {
      const response = await this.api.put(
        `/api/user/notifications/${notificationId}/read`,
        {},
        true
      );
      return { success: response.success };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async getCurrentQueue(): Promise<{ data: CurrentQueue | null }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: mockCurrentQueue };
    }

    try {
      const response = await this.api.get("/api/user/current-queue", true);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching current queue:", error);
      throw error;
    }
  }

  async getUserState(): Promise<{ data: UserState }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: {
          userId: "user123",
          isInQueue: true,
          queueId: "q5",
        },
      };
    }

    try {
      const response = await this.api.get("/api/user/state", true);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching user state:", error);
      throw error;
    }
  }

  async leaveCurrentQueue(): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { success: true };
    }

    try {
      const response = await this.api.delete("/api/user/current-queue", true);
      return { success: response.success };
    } catch (error) {
      console.error("Error leaving queue:", error);
      throw error;
    }
  }

  async getUserStats(): Promise<{ data: UserQueueStats }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: mockStats };
    }

    try {
      const response = await this.api.get("/api/user/stats", true);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  }

  async joinQueue(queueId: string): Promise<{ data: CurrentQueue }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newQueue: CurrentQueue = {
        id: "new1",
        queueId,
        queueName: "Mock Queue",
        location: "Mock Location",
        tokenNumber: "M001",
        currentPosition: 5,
        estimatedWaitTime: 20,
        joinedAt: new Date().toISOString(),
        status: "waiting",
      };
      return { data: newQueue };
    }

    try {
      const response = await this.api.post(
        "/api/user/join-queue",
        { queueId },
        true
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error joining queue:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const userQueueService = new UserQueueService();
