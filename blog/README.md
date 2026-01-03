# Yim's Blog

产品经理的思考与实践 | AI探索 | 生活记录

## 本地开发

```bash
cd blog
npm install
npm run dev
```

访问 http://localhost:4321/blog

## 添加新文章

### 方法一：手动创建

在 `src/content/posts/` 目录下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: '文章标题'
description: '文章描述'
publishDate: 2026-01-03
category: ai
draft: false
---

文章内容...
```

### 方法二：从Writing目录自动格式化

在Writing目录下写好笔记后，运行格式化脚本：

```bash
cd blog
node scripts/format-content.js
```

脚本会：
- 扫描 `Writing/` 目录下的所有Markdown文件
- 根据目录自动分类（工作项目→产品思考，AI相关→AI探索等）
- 自动提取标题、描述、发布日期
- 生成格式化的frontmatter
- 复制到 `src/content/posts/` 目录

**分类规则：**
- `工作项目/` → `product` (产品思考)
- `AI相关/` → `ai` (AI探索)
- `关系成长/`、`周月刊/` → `life` (近况生活)
- 其他目录（剪藏中转、Trash等）→ 不发布

## 构建部署

### 本地构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 自动部署到GitHub Pages

推送到main分支后，GitHub Actions会自动构建并部署到：
https://yim.github.io/blog/

## 项目结构

```
blog/
├── src/
│   ├── content/
│   │   └── posts/          # 文章内容（Markdown）
│   ├── layouts/            # 页面布局
│   ├── pages/              # 页面路由
│   └── components/         # 组件
├── public/                 # 静态资源
├── scripts/
│   └── format-content.js   # 内容格式化脚本
└── astro.config.mjs        # Astro配置
```

## 技术栈

- **Astro**: 静态站点生成器
- **MDX**: 增强的Markdown支持
- **GitHub Pages**: 免费托管
- **GitHub Actions**: 自动部署

## 主题说明

简洁黑白风格，专注内容阅读：
- 响应式设计，手机/电脑自适应
- 极简配色，减少视觉干扰
- 清晰的排版，优化阅读体验

## 下一步优化

- [ ] 添加搜索功能
- [ ] 添加RSS订阅
- [ ] 添加文章目录
- [ ] 添加代码复制按钮
- [ ] 优化移动端体验
