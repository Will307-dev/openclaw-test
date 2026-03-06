# ORCHESTRATION_R4

## Goal
第四轮：CI 真落地（GitHub Actions）
1) 新增 .github/workflows/ci.yml
2) 触发条件：push + pull_request
3) 执行：npm ci -> 安装Playwright浏览器 -> bash scripts/ci.sh
4) 失败时可定位（保留简要日志步骤）
5) 更新 REVIEW_R4.md / TEST_REPORT_R4.md / CHANGELOG_AGENT.md
