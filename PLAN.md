# PLAN - 虾兵演练-001 技术方案

## 最小技术方案

### 后端 (Node.js + Express)
- **框架**: Express.js
- **路由**:
  - `GET /health` - 健康检查 `{ ok: true }`
  - `GET /api/tasks` - 获取所有任务
  - `POST /api/tasks` - 创建任务 `{ title: string }`
  - `DELETE /api/tasks/:id` - 删除任务
- **存储**: 内存数组 (无需数据库)
- **CORS**: 允许前端跨域访问

### 前端 (HTML + Vanilla JS)
- **结构**: 单文件 `public/index.html`
- **功能**:
  - 输入框 + 添加按钮
  - 任务列表展示 (ul > li)
  - 删除按钮
  - 主题切换按钮 (light/dark)
- **样式**: 内联 CSS, CSS变量实现主题
- **状态**: localStorage 持久化主题

## 项目结构
```
xiabing-demo-001/
├── server.js           # Express 后端
├── package.json        # 依赖配置
├── public/
│   └── index.html      # 前端单页
├── PLAN.md             # 本文件
├── TASKS.md            # 任务分解
├── ORCHESTRATION.md    # 编排文档
└── CHANGELOG_AGENT.md  # 变更日志
```

## API 契约
```typescript
// GET /health
{ ok: true }

// GET /api/tasks
{ tasks: Array<{ id: string, title: string, createdAt: number }> }

// POST /api/tasks
Body: { title: string }
Response: { task: { id: string, title: string, createdAt: number } }

// DELETE /api/tasks/:id
Response: { ok: true }
```

## 验收标准
- [ ] 后端 `/health` 返回正确
- [ ] 可添加任务并展示
- [ ] 可删除任务
- [ ] 主题切换生效 (浅色/深色)
- [ ] 前端通过 localStorage 记住主题
