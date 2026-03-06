# REVIEW_R4

## Findings (2026-03-05)
1. GitHub Actions CI workflow added:
   - New `.github/workflows/ci.yml` on `ubuntu-latest` with Node.js `22`.
   - Pipeline steps execute `npm ci`, `npx playwright install --with-deps chromium`, then `bash scripts/ci.sh`.
2. `package.json` CI ergonomics improved:
   - Added script `ci` -> `bash scripts/ci.sh` for local/CI parity.
3. Verification scope alignment:
   - Local validation command remains `bash scripts/ci.sh`, matching workflow terminal step.

## Residual Risks
- GitHub runner dependency install (`--with-deps`) may take longer and occasionally vary due to apt mirror/network conditions.
- Workflow currently runs on all branch pushes; if CI minutes are constrained, branch filters can be narrowed later.
