# TEST_REPORT

## 执行环境
- Date: 2026-03-05
- Commands:
  - `npm test`
  - `npm run test:e2e`
- Runtime:
  - Node.js (`node --test`)
  - Playwright (`@playwright/test`, Chromium)

## 结果 - Unit
- tests: 5
- pass: 5
- fail: 0
- skipped: 0
- duration_ms: 740.381561

## 结果 - E2E
- tests: 1
- pass: 1
- fail: 0
- duration: 3.0s

## 覆盖项
- `GET /health` 返回 `{ ok: true }`。
- `GET /` 返回首页 HTML，且 `Content-Type` 为 `text/html`。
- `POST /api/tasks` 成功新增任务，并可通过 `GET /api/tasks` 查询到新增项。
- `POST /api/tasks` 对非法 JSON 返回 `400` 与错误信息。
- `DELETE /api/tasks/:id` 对非法 percent-encoding ID 返回 `400` 与错误信息。
- E2E：输入任务并按 Enter 创建成功，任务出现在列表中。
- E2E：点击主题切换后页面主题属性更新，并写入 `localStorage`。

## 结论
- 补救版第二轮测试全通过，单元与最小 E2E 均已落地。
