import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';

export default function Home() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      
      // 检测当前滚动到的部分
      const sections = ['about', 'projects', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <Header activeSection={activeSection} onSectionChange={handleSectionChange} />
      
      <main>
        <About id="about" />
        <Projects id="projects" />
        <Blog id="blog" />
        <Contact id="contact" />
      </main>

      {/* 页脚 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-apple-gray-900 border-t border-apple-gray-800 py-12"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-apple-white mb-2">Alex Chen</h3>
              <p className="text-apple-gray-400">后端产品经理 & 全栈开发者</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#about" className="text-apple-gray-400 hover:text-apple-white transition-colors">
                关于我
              </a>
              <a href="#projects" className="text-apple-gray-400 hover:text-apple-white transition-colors">
                项目
              </a>
              <a href="#blog" className="text-apple-gray-400 hover:text-apple-white transition-colors">
                博客
              </a>
              <a href="#contact" className="text-apple-gray-400 hover:text-apple-white transition-colors">
                联系
              </a>
            </div>
          </div>
          
          <div className="border-t border-apple-gray-800 mt-8 pt-8 text-center">
            <p className="text-apple-gray-500">
              © 2024 Alex Chen. 保留所有权利。
            </p>
          </div>
        </div>
      </motion.footer>
    </Layout>
  );
}