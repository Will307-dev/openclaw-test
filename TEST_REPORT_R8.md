# TEST_REPORT_R8

## Local Validation (2026-03-06)
- `npm run test:e2e:ci` -> PASS (3 passed, 0 failed)
- `npm run ci:strict` -> PASS
  - Coverage lines: 71.57% (>= 70%)
  - E2E: 3 passed

## CI Behavior Expectation
- 当 E2E 首次失败且重试成功：
  - Job 可通过
  - Summary 中 `Flaky(retried)` > 0
- 当 E2E 最终失败：
  - 上传 `playwright-report` / `test-results` / `e2e-test.log`
  - 可在 `test-results` 中查看 trace/screenshot 证据
