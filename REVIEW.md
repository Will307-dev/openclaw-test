# REVIEW

## Findings (2026-03-05)
1. Fixed: `DELETE /api/tasks/:id` returned `500` for malformed percent-encoded IDs (from `decodeURIComponent` throw). It now returns `400 { error: "invalid task id" }`.
2. Test gap fixed: no coverage for invalid JSON body on `POST /api/tasks`; added test asserting `400 { error: "invalid JSON body" }`.
3. Test gap fixed: no coverage for malformed encoded IDs on `DELETE /api/tasks/:id`; added test asserting `400 { error: "invalid task id" }`.

## Residual Risks
- Task storage is in-memory only; data is lost on server restart.
- No auth/rate-limiting/security headers (acceptable for demo scope, not production).
