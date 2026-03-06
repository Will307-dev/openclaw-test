# REVIEW_R2

## Findings (2026-03-05)
1. Fixed: static file routing bug in `serveStatic` caused `GET /` to fail because `path.join` received an absolute path and escaped `public` directory context.
2. Hardening: static path resolution now uses `path.resolve` and explicit boundary check (`PUBLIC_DIR` prefix + separator) to prevent serving files outside `public`.
3. Test gap fixed: added coverage for `GET /` to assert homepage is served with `text/html` content type and expected title.
4. Frontend UX fixed: request lifecycle now has explicit loading/success/error feedback, and request-in-flight disables actions to avoid duplicate submits and racey UI updates.
5. Frontend empty-state improved: when task list is empty, user sees a guided placeholder message instead of plain text item.
6. E2E gap fixed: added Playwright scenario to validate Enter-submit task creation and theme toggle persistence via `localStorage`.

## Residual Risks
- Task storage remains in-memory; restart will lose data.
- No authentication/rate limiting/security headers (acceptable for demo scope only).
- E2E currently covers only a minimal happy-path; delete flow and failure path are not yet browser-tested.
