import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { getProjects, getProjectCategories, Project } from '@/data';

interface ProjectProps {
  id: string;
}

export default function Projects({ id }: ProjectProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = getProjects();
  const categories = getProjectCategories();

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // 将分类数据转换为按钮格式，确保不重复
  const categoryButtons = [
    { id: 'all', label: '全部项目' },
    ...categories.map(cat => ({ id: cat.id, label: cat.label }))
  ].filter((cat, index, arr) => arr.findIndex(c => c.id === cat.id) === index);

  return (
    <>
      <Section id={id} title="项目展示" subtitle="我参与开发的一些有趣项目">
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

        {/* 项目网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <Card className="h-full">
                  <div className="relative mb-4 rounded-lg overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-apple-orange text-white text-xs font-semibold rounded-full">
                        精选
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-apple-white mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-apple-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-apple-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{project.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag size={14} />
                      <span>{categories.find(c => c.id === project.category)?.label}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-apple-gray-800 text-apple-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-apple-gray-800 text-apple-gray-300 text-xs rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        className="flex items-center space-x-2 text-apple-gray-400 hover:text-apple-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} />
                        <span className="text-sm">代码</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className="flex items-center space-x-2 text-apple-blue hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                        <span className="text-sm">演示</span>
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Section>

      {/* 项目详情模态框 */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-apple-gray-900 rounded-2xl border border-apple-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-apple-white">
                    {selectedProject.title}
                  </h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-lg text-apple-gray-500 hover:text-apple-white hover:bg-apple-gray-800 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                
                <p className="text-apple-gray-300 text-lg mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-apple-white mb-3">技术栈</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-apple-gray-800 text-apple-gray-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-apple-white mb-3">项目信息</h3>
                    <div className="space-y-2 text-apple-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>开发时间: {selectedProject.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag size={16} />
                        <span>分类: {categories.find(c => c.id === selectedProject.category)?.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      className="flex items-center space-x-2 px-6 py-3 bg-apple-gray-800 text-apple-white rounded-lg hover:bg-apple-gray-700 transition-colors"
                    >
                      <Github size={18} />
                      <span>查看代码</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      className="flex items-center space-x-2 px-6 py-3 bg-apple-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink size={18} />
                      <span>在线演示</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}