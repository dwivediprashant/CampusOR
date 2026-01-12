type Props = {
  onServeNext: () => void;
  onSkip: () => void;
  onRecall: () => void;
  onToggleQueue: () => void;
  queueStatus: string;
};

export default function OperatorControls({
  onServeNext,
  onSkip,
  onRecall,
  onToggleQueue,
  queueStatus,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg p-8 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">
        Queue Controls
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Serve Next Button */}
        <button
          onClick={onServeNext}
          className="group relative px-6 py-5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span className="relative z-10">Serve Next</span>
        </button>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="group relative px-6 py-5 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span className="relative z-10">Skip</span>
        </button>

        {/* Recall Button */}
        <button
          onClick={onRecall}
          className="group relative px-6 py-5 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="relative z-10">Recall</span>
        </button>

        {/* Pause/Resume Button */}
        <button
          onClick={onToggleQueue}
          className={`group relative px-6 py-5 font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 overflow-hidden ${
            queueStatus === "ACTIVE"
              ? "bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              : "bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          }`}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="relative z-10">
            {queueStatus === "ACTIVE" ? "Pause Queue" : "Resume Queue"}
          </span>
        </button>
      </div>

      <div className="mt-8 p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-700 font-medium">
            Quick actions to manage your queue efficiently
          </p>
        </div>
      </div>
    </div>
  );
}
