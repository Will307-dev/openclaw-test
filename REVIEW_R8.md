# REVIEW_R8

## Findings
1. 新增 `playwright.config.js`：
   - `retries: process.env.CI ? 1 : 0`
   - `trace: 'retain-on-failure'`
   - `screenshot: 'only-on-failure'`
   - `outputDir: 'test-results'`
2. `package.json` 新增/调整：
   - `test:e2e:ci`: `CI=1 playwright test e2e.spec.js --reporter=line`
   - `ci:strict`: `npm run test:coverage && npm run test:e2e:ci`
3. CI 工作流增强：
   - `e2e_tests` 改为运行 `npm run test:e2e:ci`
   - E2E 结果解析新增 flaky 计数
   - `GITHUB_STEP_SUMMARY` 新增 `Flaky(retried)` 与 `Retry policy`
4. 失败产物策略保持有效：
   - 失败时上传 `playwright-report`、`test-results`、`e2e-test.log`
   - 在 R8 设置下，`test-results` 将包含失败截图与 trace（便于定位）

## Residual Risks
- 当前仅设置 1 次重试，极端抖动仍可能失败；后续可按稳定性数据调整为 2。
