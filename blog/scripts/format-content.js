#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WRITING_DIR = path.resolve(__dirname, '../../Writing');
const PUBLIC_DIR = path.resolve(__dirname, '../../Public');
const CONTENT_DIR = path.resolve(__dirname, '../src/content/posts');

// 分类映射规则
const categoryRules = {
  '工作项目': 'product',
  'AI相关': 'ai',
  '关系成长': 'life',
  '周月刊': 'life',
  '剪藏中转': null, // 不发布
  'Inbox_Imports': null, // 不发布
  'Trash': null, // 不发布
  '妙言': null, // 不发布
  '周月刊洞察': null, // 不发布
};

// 读取文件并提取元数据
function extractMetadata(filePath, categoryName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');

  // 尝试从文件名或内容中提取标题
  let title = fileName;

  // 尝试提取第一个一级标题作为标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // 提取前100字作为描述
  const textContent = content
    .replace(/^---[\s\S]*?---/m, '') // 移除已有的 frontmatter
    .replace(/^#\s+.+$/m, '') // 移除标题
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/\s+/g, ' ')
    .trim();

  const description = textContent.slice(0, 100).trim() + (textContent.length > 100 ? '...' : '');

  // 获取文件修改时间作为发布日期
  const stats = fs.statSync(filePath);
  const publishDate = stats.mtime;

  return {
    title,
    description,
    publishDate,
    category: categoryRules[categoryName] || 'product',
  };
}

// 生成 frontmatter
function generateFrontmatter(metadata) {
  return `---
title: '${metadata.title.replace(/'/g, "''")}'
description: '${metadata.description.replace(/'/g, "''")}'
publishDate: ${metadata.publishDate.toISOString().split('T')[0]}
category: ${metadata.category}
draft: false
---`;
}

// 格式化并复制文件
function formatFile(sourcePath, categoryName) {
  const metadata = extractMetadata(sourcePath, categoryName);

  // 如果分类为null，跳过
  if (!metadata.category) {
    return null;
  }

  const content = fs.readFileSync(sourcePath, 'utf-8');
  const fileName = path.basename(sourcePath, '.md');
  const slug = `${fileName.toLowerCase().replace(/\s+/g, '-')}`;

  // 移除已有的 frontmatter（如果有的话）
  const cleanContent = content.replace(/^---[\s\S]*?---\n*/m, '');

  // 生成新内容
  const newContent = `${generateFrontmatter(metadata)}

${cleanContent}
`;

  // 写入目标位置
  const targetPath = path.join(CONTENT_DIR, `${slug}.md`);
  fs.writeFileSync(targetPath, newContent, 'utf-8');

  return {
    source: sourcePath,
    target: targetPath,
    slug,
    metadata,
  };
}

// 扫描并格式化所有文件
function scanAndFormat() {
  const results = [];

  // 确保目标目录存在
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  // 扫描Writing目录
  const categories = fs.readdirSync(WRITING_DIR, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;

    const categoryName = category.name;
    const categoryPath = path.join(WRITING_DIR, categoryName);

    // 跳过被排除的目录
    if (categoryRules[categoryName] === null) {
      continue;
    }

    // 读取目录中的所有md文件
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const result = formatFile(filePath, categoryName);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  }

  return results;
}

// 主函数
function main() {
  console.log('🚀 开始格式化内容...\n');

  const results = scanAndFormat();

  console.log(`✅ 完成！共处理 ${results.length} 个文件:\n`);

  // 按分类统计
  const stats = {
    product: 0,
    ai: 0,
    life: 0,
  };

  results.forEach(({ source, target, metadata }) => {
    stats[metadata.category]++;
    console.log(`  [${metadata.category}] ${metadata.title}`);
    console.log(`    → ${path.relative(process.cwd(), target)}\n`);
  });

  console.log('\n📊 统计:');
  console.log(`  产品思考: ${stats.product} 篇`);
  console.log(`  AI探索: ${stats.ai} 篇`);
  console.log(`  近况生活: ${stats.life} 篇`);
}

main();
