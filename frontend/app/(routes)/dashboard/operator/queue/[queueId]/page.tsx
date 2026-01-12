"use client";

import { apiService } from "@/app/services/api";
import NowServingCard from "@/operator/NowServingCard";
import OperatorControls from "@/operator/OperatorControls";
import OperatorHeader from "@/operator/OperatorHeader";
import TokenList from "@/operator/TokenList";
import { subscribeToQueue } from "@/lib/websocket";
import { use, useEffect, useMemo, useState } from "react";

type Token = { id: string; number: number; status: string };
type QueueData = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  location: string;
};

type PageParams = {
  params: Promise<{ queueId: string }>;
};

export default function OperatorLiveController({ params }: PageParams) {
  const { queueId } = use(params);
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nowServing, setNowServing] = useState<{
    id: string;
    number: number;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const waitingTokens = useMemo(
    () => tokens.filter((t) => t.status === "waiting"),
    [tokens]
  );

  const hydrateFromSnapshot = (payload: any) => {
    setQueue({
      id: payload.queue.id,
      name: payload.queue.name,
      location: payload.queue.location,
      status: payload.queue.status,
    });

    const mappedTokens: Token[] = payload.tokens
      .map((t: any) => ({ id: t.id, number: t.seq, status: t.status }))
      .sort((a: Token, b: Token) => a.number - b.number);

    setTokens(mappedTokens);

    const served = mappedTokens
      .filter((t) => t.status === "served")
      .sort((a, b) => b.number - a.number);
    setNowServing(
      served[0] ? { id: served[0].id, number: served[0].number } : null
    );
  };

  const loadInitial = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(
        `/queues/${queueId}/operator-view`,
        true
      );
      hydrateFromSnapshot({
        queue: data.queue,
        tokens: data.tokens.map((t: any) => ({ ...t, seq: t.number })),
      });
      setError(null);
    } catch (err: any) {
      console.error("Failed to load queue", err);
      setError(err.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
    const unsubscribe = subscribeToQueue(queueId, {
      onUpdate: hydrateFromSnapshot,
      onError: (err) => console.error("Socket error", err),
    });
    return () => {
      unsubscribe();
    };
  
  }, [queueId]);

  const callAction = async (action: string, method: "POST" | "PATCH") => {
    try {
      setActionLoading(action);
      setError(null);
      if (method === "POST") {
        await apiService.post(
          `/operator/queues/${queueId}/${action}`,
          {},
          true
        );
      } else {
        await apiService.patch(
          `/operator/queues/${queueId}/${action}`,
          {},
          true
        );
      }
    } catch (err: any) {
      setError(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const serveNext = () => callAction("serve-next", "POST");
  const skipToken = () => callAction("skip", "POST");
  const recallToken = () => callAction("recall", "POST");
  const toggleQueueStatus = () =>
    queue?.status === "ACTIVE"
      ? callAction("pause", "PATCH")
      : callAction("resume", "PATCH");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!queue) {
    return <div className="p-8 text-center text-red-500">Queue not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(15,23,42,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <div className="text-left mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Live Controller
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your queue in real time
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="text-sm font-medium text-slate-600">Waiting</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {waitingTokens.length}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="text-sm font-medium text-slate-600">
                Queue Status
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 capitalize">
                {queue.status.toLowerCase()}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="text-sm font-medium text-slate-600">
                Now Serving
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {nowServing ? nowServing.number : "None"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1 space-y-6">
              <OperatorHeader queue={queue} status={queue.status} />
              <NowServingCard token={nowServing} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <TokenList tokens={waitingTokens} />
              <OperatorControls
                onServeNext={serveNext}
                onSkip={skipToken}
                onRecall={recallToken}
                onToggleQueue={toggleQueueStatus}
                queueStatus={queue.status}
              />
              {actionLoading && (
                <p className="text-sm text-slate-500">
                  Processing {actionLoading.replace("-", " ")}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
