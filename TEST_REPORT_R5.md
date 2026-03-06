# TEST_REPORT_R5

## 执行环境
- Date: 2026-03-06
- Command:
  - `bash scripts/ci.sh`
- Runtime:
  - Node.js
  - Playwright (Chromium)

## 本地执行结果
- `npm test`：通过（5 passed, 0 failed）
- `npm run test:e2e`：通过（3 passed, 0 failed）
- 结论：`bash scripts/ci.sh` 本地执行通过。

## CI R5 对齐检查
- `.github/workflows/ci.yml` 已完成：
  - 触发：`push(main)` + `pull_request(main)` + `workflow_dispatch`
  - 并发取消：`concurrency.cancel-in-progress: true`
  - 任务超时：`timeout-minutes: 25`
  - 缓存：`npm` + `~/.cache/ms-playwright`
  - 失败上传：`playwright-report`、`test-results`
