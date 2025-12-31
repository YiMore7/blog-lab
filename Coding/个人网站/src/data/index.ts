import { profile } from '@/data/profile';
import { projects, projectCategories } from '@/data/projects';

// 博客文章类型定义
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  image: string;
  featured?: boolean;
  slug: string;
}

// 项目类型定义
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  date: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

// 获取个人资料数据
export function getProfile() {
  return profile;
}

// 获取项目数据
export function getProjects() {
  return projects;
}

// 获取项目分类
export function getProjectCategories() {
  return projectCategories;
}

// 按分类筛选项目
export function getProjectsByCategory(category: string) {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
}

// 获取精选项目
export function getFeaturedProjects() {
  return projects.filter(project => project.featured);
}