# Handle Expired/Invalid JWTs Gracefully

### Type
Bug / UX / Security

### Description
- Frontend auth context (`frontend/app/context/AuthContext.tsx`) considers a user authenticated if any JWT exists in storage; it never checks `exp` or validates the payload.
- API client (`frontend/app/services/api.ts`) always attaches the stored token and has no global 401 handling, so stale/invalid tokens persist and every call fails until the user manually clears storage.
- Revoked tokens or role changes also persist across reloads because the token is trusted until explicitly removed.

### Why this matters
- Users stay “logged in” while all API calls return 401/403, causing confusing generic errors instead of a clear session-expired flow.
- Stale tokens increase risk if backend validation is delayed and make debugging harder for contributors.

### Suggested Scope (optional)
Frontend (auth context + API client), Backend (optional refresh/validate endpoint)

### Notes (optional)
- Decode and check `exp` on load; if expired or malformed, clear token/user and mark unauthenticated.
- Add a global 401 interceptor in the API client to auto-logout (and optionally redirect to login) when the server rejects the token.
- If refresh tokens are supported or added, perform silent refresh; otherwise force re-login on expiry with a user-friendly message.
