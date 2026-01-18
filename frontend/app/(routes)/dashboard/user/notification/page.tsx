"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { userQueueService, UserNotification } from "@/lib/services/userQueueService";


export default function NotificationPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockData = await userQueueService.getNotifications(
        filter === "unread"
      );
      setNotifications(mockData.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await userQueueService.markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    for (const notification of unreadNotifications) {
      await handleMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    const baseClasses = "p-4 border-l-4 transition-all duration-200";
    const readClasses = isRead
      ? "bg-gray-50 opacity-75"
      : "bg-white hover:shadow-sm";

    switch (type) {
      case "success":
        return `${baseClasses} ${readClasses} border-green-500`;
      case "warning":
        return `${baseClasses} ${readClasses} border-yellow-500`;
      case "error":
        return `${baseClasses} ${readClasses} border-red-500`;
      case "info":
      default:
        return `${baseClasses} ${readClasses} border-blue-500`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading notifications...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-sm font-medium px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            filter === "all"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            filter === "unread"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "unread"
                ? "No Unread Notifications"
                : "No Notifications"}
            </h3>
            <p className="text-gray-600">
              {filter === "unread"
                ? "All your notifications have been read. New notifications will appear here."
                : "You don't have any notifications yet. We'll notify you about important queue updates here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={getNotificationBg(
                  notification.type,
                  notification.isRead
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message}
                    </p>

                    {notification.queueName && (
                      <div className="text-xs text-gray-500">
                        Queue: {notification.queueName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
