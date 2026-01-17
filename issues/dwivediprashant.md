# Following are the bugs and enhancements needed in the project

## 1. API Base Path Mismatch (Frontend vs Backend)

### What’s happening

- On the frontend, API calls are made to endpoints like:

  - `apiService.get("/queues", ...)`
  - `apiService.get("/operator/queues", ...)`
  - These are used in places such as `queueService.getQueues` and `OperatorLiveQueuesPage`.

- On the backend, the same routes are exposed under:

  - `/api/queues`
  - `/api/operator/queues`
  - `/api/user-status/...`

- If `NEXT_PUBLIC_API_URL` is set to something like `http://localhost:5000`, then calling `/queues` from the frontend will not hit `/api/queues` on the backend, which results in 404 errors.

- This likely explains why some API calls seem to work in certain flows but fail in others.

### Possible fixes

**Option 1: Add `/api` prefix in the frontend**

- Update frontend API calls to include `/api`, for example:

  - `/api/queues`
  - `/api/operator/queues`
  - `/api/user-status/current-queue`

- Files that would need a quick review:
  - `frontend/app/services/api.ts`
  - `frontend/app/services/queueService.ts`
  - `frontend/app/(routes)/dashboard/operator/live/page.tsx`
  - `frontend/app/(routes)/dashboard/user/queues/page.tsx`
  - `frontend/app/(routes)/dashboard/user/myqueue/page.tsx`
  - `frontend/app/(routes)/dashboard/user/page.tsx`

**Option 2: Change the backend mount point**

- If the intention is to keep routes like `/queues` without the `/api` prefix, the backend routers can be mounted at `/` instead of `/api`.

---

## 2. Duplicate Token Generation Paths (Risk Under Concurrency)

### What’s happening

- `TokenService.generateToken` uses MongoDB’s `$inc` operator to safely and atomically increment `nextSequence`.
- `UserStatusService.joinQueueWithToken` increments `queue.nextSequence` manually and then saves it.

- This means there are two different ways tokens are being generated:

  - One that is atomic and safe under concurrent requests
  - One that is not atomic and can break under load

- Under concurrent requests, this can result in duplicate token numbers, skipped sequences, or inconsistent behavior between flows.

### Possible fixes

**Option 1: Single source of truth**

- Make all token creation go through `TokenService.generateToken` and remove manual sequence updates elsewhere.

**Option 2: Make both paths atomic**

- If both flows need to exist, use `findOneAndUpdate` with `$inc` inside `joinQueueWithToken` as well.

---

## 3. Admin Analytics: “Served Today” Count May Be Off

### What’s happening

- `AdminService.getDashboardSummary` calculates “served today” using:

  - `status: served`
  - `updatedAt` within today’s date range

- In `OperatorService.serveNextToken`, the previously served token is quickly updated to `completed`.

- Because of this:
  - Tokens stay in the `served` state only for a short time
  - The “served today” count is likely lower than the actual number of tokens handled

### Possible fixes

**Option 1: Store a `servedAt` timestamp**

- Add a `servedAt` field when a token is served and use that field for analytics instead of `updatedAt`.

**Option 2: Count completed tokens**

- If “served” is meant to represent a fully handled token, analytics should be based on `status: completed` instead.
