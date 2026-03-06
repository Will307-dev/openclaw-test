# REVIEW_R3

## Findings (2026-03-05)
1. E2E coverage expanded for delete workflow:
   - Added browser test for successful delete flow (create -> delete -> empty-state + success status).
2. E2E coverage expanded for exception path:
   - Added browser test intercepting `DELETE /api/tasks/:id` with `404 { error: "task not found" }`, asserting error status and no unintended UI removal.
3. Test stability fix:
   - Switched E2E server lifecycle from `beforeAll/afterAll` to `beforeEach/afterEach` to isolate in-memory task store per test and eliminate cross-test interference.
4. CI convenience script added:
   - Added `scripts/ci.sh` running `npm test && npm run test:e2e` with `set -euo pipefail`.

## Residual Risks
- Task storage remains in-memory; restart clears all tasks.
- E2E currently validates delete happy/failure paths, but does not yet simulate network timeout/abort or initial load failure.
