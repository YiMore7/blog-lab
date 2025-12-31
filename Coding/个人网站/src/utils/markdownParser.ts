// 简单的Markdown前端元数据解析器，适用于浏览器环境
export function parseMarkdownWithFrontmatter(content: string) {
  const lines = content.split('\n');
  const frontmatter: Record<string, any> = {};
  let contentStart = 0;
  let inFrontmatter = false;
  
  // 解析前端元数据
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        contentStart = i + 1;
        break;
      }
    }
    
    if (inFrontmatter) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        
        // 处理数组格式
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            // 如果不是有效的JSON数组，按字符串处理
          }
        }
        
        // 处理布尔值
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        frontmatter[key] = value;
      }
    }
  }
  
  const markdownContent = lines.slice(contentStart).join('\n').trim();
  
  return {
    data: frontmatter,
    content: markdownContent
  };
}