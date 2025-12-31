// 项目数据配置
export const projects = [
  {
    id: "ai-workflow-system",
    title: "AI 工作流管理系统",
    description: "基于人工智能的任务管理和自动化工作流平台，帮助团队提升工作效率。",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20AI%20workflow%20management%20system%20dashboard%20with%20clean%20dark%20interface%2C%20minimalist%20design%2C%20task%20cards%2C%20progress%20bars%2C%20professional%20UI&image_size=landscape_16_9",
    category: "ai",
    technologies: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
    date: "2024-03",
    githubUrl: "https://github.com/yourusername/ai-workflow-system",
    liveUrl: "https://ai-workflow-demo.com",
    featured: true
  },
  {
    id: "data-analytics-platform",
    title: "智能数据分析平台",
    description: "企业级数据分析和可视化平台，支持多维度数据洞察和预测分析。",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analytics%20platform%20dashboard%20with%20charts%20and%20graphs%2C%20dark%20theme%2C%20modern%20UI%2C%20professional%20design%2C%20clean%20interface&image_size=landscape_16_9",
    category: "data",
    technologies: ["Vue.js", "D3.js", "Node.js", "MongoDB", "Redis"],
    date: "2024-01",
    githubUrl: "https://github.com/yourusername/data-analytics-platform",
    liveUrl: "https://data-analytics-demo.com"
  },
  {
    id: "mobile-task-app",
    title: "移动端任务管理应用",
    description: "跨平台移动应用，提供直观的任务管理和团队协作功能。",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Mobile%20task%20management%20app%20interface%2C%20clean%20design%2C%20dark%20theme%2C%20task%20list%2C%20modern%20mobile%20UI%2C%20professional%20look&image_size=portrait_16_9",
    category: "mobile",
    technologies: ["React Native", "Expo", "Firebase", "Redux"],
    date: "2023-11",
    githubUrl: "https://github.com/yourusername/mobile-task-app",
    featured: true
  },
  {
    id: "pkm-system",
    title: "个人知识管理系统",
    description: "基于PKM理念构建的个人知识管理和学习笔记系统。",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Personal%20knowledge%20management%20system%20interface%2C%20note-taking%20app%2C%20dark%20theme%2C%20clean%20design%2C%20knowledge%20graph%2C%20modern%20UI&image_size=landscape_16_9",
    category: "productivity",
    technologies: ["Next.js", "TypeScript", "Prisma", "SQLite"],
    date: "2023-09",
    githubUrl: "https://github.com/yourusername/pkm-system"
  }
];

// 项目分类配置
export const projectCategories = [
  { id: "all", label: "全部项目" },
  { id: "ai", label: "AI项目" },
  { id: "data", label: "数据分析" },
  { id: "mobile", label: "移动应用" },
  { id: "productivity", label: "效率工具" }
];