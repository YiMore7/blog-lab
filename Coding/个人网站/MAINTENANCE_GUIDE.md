# 网站维护指南

## 🎯 维护目标
通过简单的文件编辑和Git提交，实现网站内容的动态更新，无需复杂的后台管理系统。

## 📁 文件结构

```
src/data/                    # 数据配置目录
├── profile.ts              # 个人资料配置
├── projects.ts              # 项目数据配置
├── blog.ts                  # 博客数据加载工具
├── index.ts                 # 数据导出工具
└── content/                 # 内容文件夹
    ├── blog/                # 博客文章Markdown文件
    │   ├── how-i-use-ai.md
    │   ├── product-development-process.md
    │   └── technology-selection.md
    └── projects/              # 项目相关文件（可选）
```

## 📝 维护方式

### 1. 更新个人资料
编辑文件：`src/data/profile.ts`

```typescript
export const profile = {
  name: "您的姓名",
  title: "您的职位",
  bio: "您的个人简介...",
  avatar: {
    type: "text",  // 或 "image"
    text: " initials",  // 如果type为"text"
    imageUrl: ""  // 如果type为"image"
  },
  skills: ["技能1", "技能2", "技能3"],
  social: {
    github: "您的GitHub链接",
    linkedin: "您的LinkedIn链接",
    twitter: "您的Twitter链接",
    email: "您的邮箱",
    wechat: "您的微信号"
  },
  contact: {
    email: "联系邮箱",
    phone: "联系电话",
    location: "所在位置",
    responseTime: "响应时间"
  }
};
```

### 2. 更新项目展示
编辑文件：`src/data/projects.ts`

```typescript
export const projects = [
  {
    id: "项目ID",
    title: "项目名称",
    description: "项目描述",
    image: "项目图片URL",
    category: "项目分类",
    technologies: ["技术1", "技术2"],
    date: "2024-03",
    githubUrl: "GitHub链接",
    liveUrl: "在线演示链接",
    featured: true  // 是否为精选项目
  }
];
```

### 3. 添加/更新博客文章

#### 创建新文章
在 `src/data/content/blog/` 目录下创建新的 `.md` 文件，例如：`my-new-post.md`

#### 文章格式
```markdown
---
title: "文章标题"
date: "2024-03-15"
readTime: "5 分钟"
tags: ["标签1", "标签2", "标签3"]
category: "文章分类"
featured: true  # 是否为精选文章
image: "文章封面图片URL"
---

# 文章标题

文章内容，支持Markdown格式...

## 二级标题

正文内容...

### 三级标题

更多内容...
```

#### 文章分类
可用的分类包括：
- `productivity` - 效率提升
- `product-management` - 产品管理  
- `technology` - 技术分享
- `ai` - 人工智能
- `career` - 职业发展

## 🚀 更新流程

### 本地更新步骤
1. **编辑文件**：根据需要修改相应的配置文件或添加新的博客文章
2. **本地预览**：运行 `npm run dev` 查看更改效果
3. **代码检查**：运行 `npm run lint` 和 `npm run check` 确保代码质量
4. **构建测试**：运行 `npm run build` 确保构建成功

### 部署更新
1. **提交更改**：
   ```bash
   git add .
   git commit -m "更新：描述您的更改内容"
   git push origin main
   ```

2. **自动部署**：如果您配置了自动部署，推送到主分支后会自动触发部署

3. **手动部署**：
   ```bash
   npm run build
   # 将 dist 目录中的文件上传到您的服务器或静态托管平台
   ```

## 💡 维护建议

### 内容更新频率
- **个人资料**：有重大变化时更新
- **项目展示**：每完成一个新项目就添加
- **博客文章**：建议每月至少更新1-2篇

### 最佳实践
1. **定期备份**：定期将您的数据文件备份到云端
2. **版本控制**：使用Git进行版本管理，方便回滚
3. **图片优化**：上传图片前先压缩，提高加载速度
4. **SEO优化**：为每篇文章设置合适的标题和描述

### 故障排除
- **构建失败**：检查TypeScript类型错误
- **样式问题**：确保Tailwind CSS类名正确
- **数据不更新**：重启开发服务器或清除缓存

## 🔧 高级功能（可选）

### 添加新分类
1. 在 `src/data/projects.ts` 中添加新的项目分类
2. 在博客文章的frontmatter中使用新的分类

### 自定义样式
编辑 `tailwind.config.js` 来自定义颜色、字体等样式

### 添加新页面
1. 创建新的组件文件
2. 在 `src/pages/Home.tsx` 中添加对应的路由

## 📞 技术支持

如遇到问题，可以：
1. 检查浏览器控制台错误信息
2. 查看构建日志
3. 确保所有依赖包已正确安装
4. 参考原始项目文档

这个维护系统设计简单直观，您只需要编辑文本文件即可更新网站内容，非常适合您的需求！