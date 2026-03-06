# REVIEW_R7

## Findings
1. 已引入 `c8` 覆盖率检查并设置行覆盖率阈值 70%。
2. `package.json` 新增：
   - `test:coverage`: 运行 `node --test` 并执行 c8 覆盖率门禁
   - `ci:strict`: 串联 `test:coverage + test:e2e`
3. CI `unit_tests` 新增 coverage 步骤并写入 `GITHUB_STEP_SUMMARY`。
4. CI `unit_tests` 与 `e2e_tests` 的 `npm ci` 均加入 3 次轻量重试（5 秒间隔）。
5. CI unit 失败时上传覆盖率诊断产物：`coverage.log` 与 `coverage/`。

## Risk / Notes
- 覆盖率阈值当前仅门禁 lines（70%），branches 仅展示不门禁。
- 如果后续增加路由/分支，建议同步补单测以避免门禁波动。
