# UI_NOTES

## 2026-03-05 R2 补救版

### 交互优化完成项
- 回车提交：在 `#task-input` 显式监听 Enter，触发 `form.requestSubmit()`。
- 防重复提交：请求进行中统一禁用输入框、提交按钮、主题切换与删除按钮。
- 空态提示：任务列表为空时显示友好提示文案（引导输入并回车创建）。
- 请求中状态：加载/创建/删除阶段展示 `status` 提示并标记 `data-type="loading"`。
- 错误提示：接口失败时从后端错误消息回填，兜底为中文失败提示。
- 成功提示：创建/删除/主题切换后给出明确成功反馈。

### 关联文件
- `public/index.html`
- `public/app.js`
- `public/style.css`
