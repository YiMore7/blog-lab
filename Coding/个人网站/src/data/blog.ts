import { parseMarkdownWithFrontmatter } from '@/utils/markdownParser';

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

// 动态导入所有Markdown文件
const blogModules = import.meta.glob<string>('../data/content/blog/*.md', {
  as: 'raw',
  eager: true
});

// 解析Markdown文件
function parseMarkdownFile(content: string, filePath: string): BlogPost {
  const { data: frontmatter, content: markdownContent } = parseMarkdownWithFrontmatter(content);
  const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
  
  return {
    id: fileName,
    slug: fileName,
    title: frontmatter.title || '无标题',
    excerpt: frontmatter.excerpt || markdownContent.slice(0, 200) + '...',
    content: markdownContent,
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    readTime: frontmatter.readTime || '5 分钟',
    tags: frontmatter.tags || [],
    category: frontmatter.category || 'uncategorized',
    image: frontmatter.image || 'https://via.placeholder.com/800x400',
    featured: frontmatter.featured || false
  };
}

// 获取所有博客文章
export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  Object.entries(blogModules).forEach(([filePath, content]) => {
    try {
      const post = parseMarkdownFile(content, filePath);
      posts.push(post);
    } catch (error) {
      console.error(`解析博客文件失败: ${filePath}`, error);
    }
  });
  
  // 按日期排序（最新的在前）
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取精选文章
export function getFeaturedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter(post => post.featured);
}

// 按分类获取文章
export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === 'all') return getAllBlogPosts();
  return getAllBlogPosts().filter(post => post.category === category);
}

// 按标签获取文章
export function getBlogPostsByTag(tag: string): BlogPost[] {
  return getAllBlogPosts().filter(post => post.tags.includes(tag));
}

// 获取文章详情
export function getBlogPostBySlug(slug: string): BlogPost | null {
  return getAllBlogPosts().find(post => post.slug === slug) || null;
}

// 获取所有分类
export function getBlogCategories(): string[] {
  const posts = getAllBlogPosts();
  const categories = new Set(posts.map(post => post.category));
  return Array.from(categories);
}

// 获取所有标签
export function getBlogTags(): string[] {
  const posts = getAllBlogPosts();
  const tags = new Set(posts.flatMap(post => post.tags));
  return Array.from(tags);
}