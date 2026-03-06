# TEST_REPORT_R6

## 执行环境
- Date: 2026-03-06
- Commands:
  - `npm test`
  - `npm run test:e2e`
- Runtime:
  - Node.js
  - Playwright (Chromium)

## 本地执行结果
- `npm test`：通过（5 passed, 0 failed）
- `npm run test:e2e`：通过（3 passed, 0 failed）

## CI R6 对齐检查
- `.github/workflows/ci.yml` 已完成：
  - 并行 jobs：`unit_tests` + `e2e_tests`
  - 两个 job 均使用 Node 22
  - `e2e_tests` 安装 Chromium：`npx playwright install --with-deps chromium`
  - 两个 job 均写入 `GITHUB_STEP_SUMMARY`（状态、测试总数、通过/失败）
  - 失败上传产物：
    - unit: `unit-test.log`
    - e2e: `playwright-report`、`test-results`、`e2e-test.log`
