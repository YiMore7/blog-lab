# 网站内容维护 - 快速开始

## 🚀 最简单的维护方式

### 1. 修改个人信息
打开文件：`src/data/profile.ts`
- 修改姓名、职位、简介
- 更新技能标签
- 修改社交媒体链接

### 2. 更新项目
打开文件：`src/data/projects.ts`
- 添加新项目到数组中
- 修改现有项目信息
- 更新项目图片URL

### 3. 添加博客文章
1. 在 `src/data/content/blog/` 目录创建新文件，如：`my-new-post.md`
2. 复制以下模板：

```markdown
---
title: "文章标题"
date: "2024-03-15"
readTime: "5 分钟"
tags: ["标签1", "标签2"]
category: "technology"
---

# 文章标题

您的文章内容...
```

### 4. 提交更新
```bash
git add .
git commit -m "更新了个人信息和添加了新文章"
git push origin main
```

## 📋 维护清单

- [ ] 个人资料更新
- [ ] 项目信息更新  
- [ ] 博客文章添加
- [ ] 本地预览测试
- [ ] 代码提交推送

## ⚡ 快速命令

```bash
# 启动本地预览
npm run dev

# 检查代码质量
npm run lint

# 构建生产版本
npm run build
```

## 📖 详细指南
如需更详细的维护说明，请查看 `MAINTENANCE_GUIDE.md`