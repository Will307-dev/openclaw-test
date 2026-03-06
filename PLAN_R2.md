# PLAN_R2 - 虾兵演练-002 执行计划

## 任务拆分

### Phase 1: 后端与文档 (Claude Code)
- [ ] API 异常路径完善
  - [ ] 错误响应格式统一（JSON + status code）
  - [ ] 404/500 边界处理
  - [ ] API 文档更新（异常场景说明）

- [ ] 单元测试补充
  - [ ] 错误路径覆盖（DELETE 不存在的任务）
  - [ ] 边界条件测试

### Phase 2: 前端交互增强 (Gemini)
- [ ] 回车提交快捷键
  - [ ] 监听 input Enter 事件
  - [ ] 防止重复提交

- [ ] 空态提示
  - [ ] 无任务时显示 placeholder
  - [ ] 设计友好提示文案

- [ ] 加载/错误态优化
  - [ ] 请求时 loading 指示
  - [ ] 错误时 toast/inline 提示

### Phase 3: E2E 验证 (Gemelli)
- [ ] 环境准备
  - [ ] 优先 browser-use（Python）
  - [ ] Fallback: Playwright (Node)

- [ ] 测试场景
  - [ ] 打开首页并验证标题
  - [ ] 创建新任务并验证展示
  - [ ] 删除任务并验证消失
  - [ ] 主题切换并验证持久化

### Phase 4: 代码审查 (Codex)
- [ ] 代码质量检查
- [ ] 安全漏洞扫描
- [ ] 单元测试覆盖率验证

### Phase 5: 交付物整理
- [ ] UI_NOTES.md (前端改进说明)
- [ ] E2E_REPORT.md (测试报告)
- [ ] REVIEW_R2.md (审核结论)
- [ ] TEST_REPORT.md (更新)

## 风险

| 风险项 | 影响 | 缓解措施 |
|--------|------|----------|
| browser-use 环境依赖问题 | E2E 延迟 | 预留 Playwright fallback |
| 主题切换 localStorage 兼容性 | 用户体验 | 降级处理（无 storage 忽略） |
| API 异常响应格式不统一 | 调试困难 | 提前定义统一 schema |
| 三 Agent 协作同步成本 | 进度延误 | 明确交付物格式与依赖关系 |

## 交接点

1. **Phase 1 → Phase 2**: Claude 完成 API 文档后，Gemini 基于更新文档调整前端错误处理
2. **Phase 2 → Phase 3**: Gemini 完成前端后，验证 UI 稳定性，交付 E2E 测试脚本
3. **Phase 3 → Phase 4**: E2E 通过后，Codex 执行代码审查与测试覆盖率验证
4. **Phase 4 → Phase 5**: 审查通过后，汇总所有交付物，生成最终报告

## 里程碑

| 阶段 | 预计耗时 | 产出 |
|------|----------|------|
| 后端与文档 | 30min | API 文档更新、错误处理完善 |
| 前端增强 | 45min | UI 交互优化、空态/加载态 |
| E2E 验证 | 40min | 自动化测试脚本与报告 |
| 代码审查 | 20min | 安全与质量检查 |
| 交付物整理 | 15min | 完整文档集 |

**总预计耗时**: 150 分钟（2.5 小时）
