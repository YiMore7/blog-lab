# 个人网站使用指南

## 项目简介
这是一个使用 **Vite + React + TypeScript + Tailwind CSS** 构建的现代化个人网站，采用 Apple 风格设计，支持深色主题和流畅动画效果。

## 如何查看网站效果

### 方式一：开发模式（推荐）
1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   启动成功后，终端会显示本地地址（通常是 `http://localhost:5173`）

3. **访问网站**
   - 用浏览器打开显示的本地地址
   - 支持热重载，修改文件后页面会自动刷新

### 方式二：生产构建预览
1. **构建项目**
   ```bash
   npm run build
   ```

2. **预览构建结果**
   ```bash
   npm run preview
   ```
   或者直接打开 `dist/index.html` 文件

## 在哪里维护本地文件内容

### 核心数据文件（推荐维护位置）
```
src/data/
├── profile.ts          # 个人简介信息
├── projects.ts         # 项目展示数据
├── blog.ts            # 博客系统配置
└── content/blog/      # Markdown博客文章
    ├── how-i-use-ai.md
    ├── product-development-process.md
    └── technology-selection.md
```

### 页面组件
```
src/components/
├── About.tsx           # 个人简介页面
├── Projects.tsx        # 项目展示页面
├── Blog.tsx           # 博客列表页面
└── Contact.tsx        # 联系方式页面
```

### 静态资源
```
public/
└── favicon.svg        # 网站图标
```

## 快速维护指南

### 1. 更新个人信息
编辑 `src/data/profile.ts`：
```typescript
export const profile = {
  name: "你的名字",
  title: "你的职位",
  bio: "个人简介...",
  skills: ["技能1", "技能2", "技能3"],
  // ... 其他信息
}
```

### 2. 添加/修改项目
编辑 `src/data/projects.ts`：
```typescript
export const projects = [
  {
    id: "project-id",
    title: "项目名称",
    description: "项目描述...",
    tags: ["标签1", "标签2"],
    link: "项目链接",
    image: "项目图片链接"
  }
  // ... 更多项目
]
```

### 3. 发布博客文章
1. **创建Markdown文件**
   在 `src/data/content/blog/` 目录下创建新的 `.md` 文件

2. **添加文章元数据和内容**
   ```markdown
   ---
   title: "文章标题"
   date: "2024-01-01"
   excerpt: "文章摘要..."
   tags: ["标签1", "标签2"]
   category: "技术"
   ---
   
   # 标题
   
   正文内容...
   
   ## 插入图片
   
   ### 方法一：使用图床服务（推荐）
   1. 上传图片到图床服务（如 imgur.com、sm.ms）
   2. 获得图片直链URL
   3. 在文章中引用：
   
   ```markdown
   ![系统架构图](https://i.imgur.com/abc123.png)
   ![流程图](https://example.com/image.png)
   
   支持多张图片：
   ![架构图](https://i.imgur.com/architecture.png)
   ![流程图](https://i.imgur.com/workflow.png)
   ```
   
   ### 方法二：使用外部图片链接
   ```markdown
   ![示例图片](https://via.placeholder.com/800x400)
   ```

3. **图片使用建议**
   - 使用可靠的图床服务（推荐 imgur.com）
   - 为每张图片添加准确的描述文字
   - 控制图片尺寸，建议宽度 800-1200px
   - 重要图片建议保存多个备份链接

### 4. 修改联系方式
编辑 `src/data/profile.ts` 中的 `contact` 部分：
```typescript
contact: {
  email: "your-email@example.com",
  github: "your-github-username",
  linkedin: "your-linkedin-username",
  twitter: "your-twitter-username"
}
```

## 常用命令
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview

# 代码检查（如配置了）
npm run lint
```

## 注意事项
1. **不要直接双击打开 `index.html`** - 使用 `npm run dev` 或构建后预览
2. **图片资源** - 放在 `public` 目录下，引用路径以 `/` 开头
3. **修改后保存** - 开发模式下会自动热重载
4. **Git提交** - 修改完成后提交到Git仓库即可更新网站内容

## 目录结构速览
```
个人网站/
├── src/                    # 源代码
│   ├── data/              # 数据文件（主要维护位置）
│   ├── components/        # 页面组件
│   ├── utils/             # 工具函数
│   └── ...
├── public/                # 静态资源
├── dist/                  # 构建输出（自动生成）
├── index.html             # 入口文件
├── package.json           # 项目配置
└── USAGE_GUIDE.md         # 本使用指南
```

## 技术支持
- **框架**: Vite + React + TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **Markdown**: 自定义解析器（浏览器兼容）

---
**最后更新**: 2024年
**文档位置**: `/Users/yim/Documents/Building/Coding/个人网站/USAGE_GUIDE.md`