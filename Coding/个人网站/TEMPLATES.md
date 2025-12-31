# 数据配置模板

## 个人资料模板
复制以下内容到 `src/data/profile.ts` 并进行修改：

```typescript
export const profile = {
  name: "您的姓名",
  title: "您的职位",
  bio: "您的个人简介...",
  avatar: {
    type: "text", // 或 "image"
    text: "姓名首字母",   
    imageUrl: ""  // 如果使用图片头像
  },
  skills: [
    "技能1", "技能2", "技能3", "技能4", "技能5"
  ],
  social: {
    github: "https://github.com/您的用户名",
    linkedin: "https://linkedin.com/in/您的用户名", 
    twitter: "https://twitter.com/您的用户名",
    email: "您的邮箱@example.com",
    wechat: "您的微信号"
  },
  contact: {
    email: "联系邮箱@example.com",
    phone: "+86 138 0000 0000",
    location: "您的城市，国家",
    responseTime: "24小时内回复"
  }
};
```

## 项目模板
复制以下内容到 `src/data/projects.ts` 并进行修改：

```typescript
export const projects = [
  {
    id: "project-id",
    title: "项目名称",
    description: "项目简短描述，说明项目的主要功能和特点",
    image: "项目截图或展示图片的URL",
    category: "项目分类", // ai, data, mobile, productivity
    technologies: ["技术1", "技术2", "技术3"],
    date: "2024-03",
    githubUrl: "https://github.com/您的用户名/项目名",
    liveUrl: "https://项目演示地址.com", // 可选
    featured: true  // 是否为精选项目
  }
];
```

## 博客文章模板
在 `src/data/content/blog/` 目录创建新文件，如：`my-article.md`

```markdown
---
title: "文章标题"
date: "2024-03-15"
readTime: "5 分钟"
tags: ["标签1", "标签2", "标签3"]
category: "文章分类" # productivity, product-management, technology, ai, career
featured: true  # 是否为精选文章
image: "文章封面图片URL"
---

# 文章主标题

文章内容开始...

## 二级标题

更多内容...

### 三级标题

详细内容...

## 总结

文章结尾...
```

## 常用分类说明

### 项目分类
- `ai` - 人工智能项目
- `data` - 数据分析项目  
- `mobile` - 移动应用项目
- `productivity` - 效率工具项目
- `web` - 网页应用项目
- `other` - 其他类型项目

### 博客分类
- `productivity` - 效率提升
- `product-management` - 产品管理
- `technology` - 技术分享
- `ai` - 人工智能
- `career` - 职业发展
- `personal` - 个人感悟

## 图片资源建议
- 项目截图：使用实际项目界面截图
- 博客封面：使用相关主题的高质量图片
- 头像：使用专业个人照片或品牌Logo
- 图片尺寸建议：16:9 比例，宽度至少800px

## 更新检查清单
- [ ] 所有链接都能正常访问
- [ ] 图片URL有效且加载正常
- [ ] 日期格式正确 (YYYY-MM-DD)
- [ ] 分类名称与定义一致
- [ ] Markdown语法正确（博客文章）
- [ ] 本地预览效果正常