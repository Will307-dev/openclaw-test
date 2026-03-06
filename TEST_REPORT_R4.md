# TEST_REPORT_R4

## 执行环境
- Date: 2026-03-05
- Command:
  - `bash scripts/ci.sh`
- Runtime:
  - Node.js
  - Playwright (Chromium)

## 本地执行结果
- `npm test`：通过
- `npm run test:e2e`：通过
- 结论：`bash scripts/ci.sh` 本地执行通过。

## CI 工作流对齐检查
- `.github/workflows/ci.yml` 已配置：
  - `runs-on: ubuntu-latest`
  - `actions/setup-node` 使用 Node `22`
  - 顺序执行 `npm ci` -> `npx playwright install --with-deps chromium` -> `bash scripts/ci.sh`
