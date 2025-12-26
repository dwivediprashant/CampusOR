"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">CampusOR</h1>

      <p className="mt-4 max-w-xl text-gray-600">
        Campus Online Queue & Reservation System.
        Join queues digitally, track your position in real time,
        and eliminate physical waiting lines.
      </p>

      <div className="mt-8 flex gap-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="px-6 py-2 rounded bg-black text-white"
            >
              Login
            </Link>

            <Link
              href="/queue"
              className="px-6 py-2 rounded border"
            >
              Join Queue
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/queue"
              className="px-6 py-2 rounded bg-black text-white"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={logout}
              className="px-6 py-2 rounded border"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </main>
  );
}
