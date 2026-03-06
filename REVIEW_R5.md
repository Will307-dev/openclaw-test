# REVIEW_R5

## Findings (2026-03-06)
1. CI 触发策略收敛并保留手动可配置入口：
   - `.github/workflows/ci.yml` 由全分支 push 改为仅 `main` push + `pull_request` 到 `main`。
   - 新增 `workflow_dispatch`，保留手动触发能力（可配置入口）。
2. 并发与执行时长治理：
   - 新增 `concurrency`（按 `workflow + ref` 分组），`cancel-in-progress: true`，取消同分支重复运行。
   - `test` job 增加 `timeout-minutes: 25`，避免异常挂起占用 CI 资源。
3. 缓存优化：
   - 保留 `actions/setup-node` 的 `cache: npm`（npm 依赖缓存）。
   - 新增 `actions/cache` 缓存 `~/.cache/ms-playwright`（Playwright 浏览器缓存）。
4. 失败诊断增强：
   - 新增失败后上传步骤（`if: failure()`），上传 `playwright-report` 与 `test-results`，并设置 `if-no-files-found: ignore`。

## Residual Risks
- `workflow_dispatch` 的输入目前仅作为手动触发入口描述，未驱动条件分支；如需参数化行为（例如跳过 E2E），后续可补充 job/step 条件。
- Playwright 缓存 key 基于 `package-lock.json`，若浏览器版本变更由其他因素触发，可能短期回退到 restore key 命中。
