"use client";

import { useState, useEffect } from "react";
import {
  ListChecks,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Search,
} from "lucide-react";
import {
  userQueueService,
  CurrentQueue,
  UserState,
} from "../../../../../lib/services/userQueueService";

export default function MyQueuePage() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [currentQueue, setCurrentQueue] = useState<CurrentQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leavingQueue, setLeavingQueue] = useState(false);

  useEffect(() => {
    fetchUserState();
    fetchCurrentQueue();

    const interval = setInterval(fetchCurrentQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserState = async () => {
    try {
      const stateData = await userQueueService.getUserState();
      setUserState(stateData.data);
    } catch (err) {
      console.error("Error fetching user state:", err);
    }
  };

  const fetchCurrentQueue = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockData = await userQueueService.getCurrentQueue();
      setCurrentQueue(mockData.data);
    } catch (err) {
      console.error("Error fetching current queue:", err);
      setError("Failed to load your current queue. Please try again.");

      const mockData = await userQueueService.getCurrentQueue();
      setCurrentQueue(mockData.data);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!currentQueue) return;

    const confirmed = window.confirm(
      `Are you sure you want to leave the queue for ${currentQueue.queueName}? Your token ${currentQueue.tokenNumber} will be cancelled.`
    );

    if (!confirmed) return;

    try {
      setLeavingQueue(true);
      await userQueueService.leaveCurrentQueue();
      setCurrentQueue(null);
    } catch (err) {
      console.error("Error leaving queue:", err);
      alert("Failed to leave queue. Please try again.");
    } finally {
      setLeavingQueue(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-blue-100 text-blue-800";
      case "near":
        return "bg-yellow-100 text-yellow-800";
      case "serving":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Waiting";
      case "near":
        return "Your Turn Soon";
      case "serving":
        return "Being Served";
      default:
        return "Unknown";
    }
  };

  const getWaitTimeColor = (minutes: number) => {
    if (minutes <= 5) return "text-green-600";
    if (minutes <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ListChecks className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">My Queue</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading your queue status...
            </span>
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
          <ListChecks className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">My Queue</h1>
        </div>

        <button
          onClick={fetchCurrentQueue}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      {/* Queue Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {userState?.isInQueue && currentQueue ? (
          <div className="p-6">
            {/* Queue Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {currentQueue.queueName}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentQueue.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Joined at {formatTime(currentQueue.joinedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    currentQueue.status
                  )}`}
                >
                  {getStatusText(currentQueue.status)}
                </span>
              </div>
            </div>

            {/* Token and Position */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Your Token</div>
                <div className="text-2xl font-bold text-blue-600 font-mono">
                  {currentQueue.tokenNumber}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">
                  Position in Queue
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  #{currentQueue.currentPosition}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">
                  Estimated Wait Time
                </div>
                <div
                  className={`text-2xl font-bold ${getWaitTimeColor(
                    currentQueue.estimatedWaitTime
                  )}`}
                >
                  {currentQueue.estimatedWaitTime}m
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    {currentQueue.status === "near"
                      ? "Get Ready!"
                      : "Please Wait"}
                  </h3>
                  <p className="text-sm text-blue-800">
                    {currentQueue.status === "near"
                      ? `You are ${
                          currentQueue.currentPosition === 1
                            ? "next"
                            : `${currentQueue.currentPosition - 1} people away`
                        } from being served. Please proceed to the service area.`
                      : currentQueue.status === "serving"
                      ? "Your token is being served now. Please remain at the counter."
                      : `There are ${
                          currentQueue.currentPosition - 1
                        } people ahead of you. We'll notify you when your turn is approaching.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLeaveQueue}
                disabled={leavingQueue}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {leavingQueue ? "Leaving..." : "Leave Queue"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Not in Any Queue
            </h3>
            <p className="text-gray-600 mb-6">
              You are currently not in any queue. Join a queue to see your
              status here.
            </p>
            <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Search className="w-4 h-4" />
              Browse Available Queues
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {userState?.isInQueue && currentQueue && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-3">
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Please keep your device notifications enabled to receive alerts
                when your turn is approaching.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Estimated wait times are calculated based on current service
                rates and may vary.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                If you miss your turn, please contact the service desk for
                assistance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                You can leave the queue at any time, but your token will be
                cancelled.
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
