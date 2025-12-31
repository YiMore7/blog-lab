import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { getAllBlogPosts, getBlogCategories, BlogPost } from '@/data/blog';

interface BlogProps {
  id: string;
}

export default function Blog({ id }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogPosts = getAllBlogPosts();
  const categories = getBlogCategories();

  // 将分类数据转换为按钮格式
  const categoryButtons = [
    { id: 'all', label: '全部文章' },
    ...categories.map(cat => ({ id: cat, label: cat }))
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  if (selectedPost) {
    return (
      <article className="min-h-screen bg-apple-black text-apple-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedPost(null)}
            className="flex items-center space-x-2 text-apple-gray-400 hover:text-apple-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回博客</span>
          </motion.button>

          {/* 文章头部 */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="mb-6">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-apple-gray-900 text-apple-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-apple-white">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-apple-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* 文章内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedPost.content}
            </ReactMarkdown>
          </motion.div>

          {/* 文章底部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t border-apple-gray-800"
          >
            <div className="flex flex-wrap gap-4">
              <span className="text-apple-gray-400">标签:</span>
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-apple-gray-900 text-apple-gray-300 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </article>
    );
  }

  return (
    <Section id={id} title="博客文章" subtitle="分享我的思考、经验和见解">
      {/* 分类筛选 */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categoryButtons.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-apple-blue text-apple-white'
                : 'bg-apple-gray-900 text-apple-gray-400 hover:text-apple-white hover:bg-apple-gray-800'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <Card className="h-full">
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                {post.featured && (
                  <div className="absolute top-2 left-2 px-3 py-1 bg-apple-orange text-white text-xs font-semibold rounded-full">
                    精选
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-apple-gray-900 text-apple-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold text-apple-white line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-apple-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-apple-gray-500 pt-4 border-t border-apple-gray-800">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}