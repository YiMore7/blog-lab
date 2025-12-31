import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { getProfile } from '@/data';

interface ContactProps {
  id: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact({ id }: ContactProps) {
  const profile = getProfile();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: Mail,
      label: '邮箱',
      value: profile.contact.email,
      href: `mailto:${profile.contact.email}`
    },
    {
      icon: Phone,
      label: '电话',
      value: profile.contact.phone,
      href: `tel:${profile.contact.phone.replace(/\s/g, '')}`
    },
    {
      icon: MapPin,
      label: '位置',
      value: profile.contact.location,
      href: '#'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: profile.social.github,
      color: 'hover:text-gray-300'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: profile.social.linkedin,
      color: 'hover:text-blue-400'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: profile.social.twitter,
      color: 'hover:text-blue-400'
    },
    {
      icon: MessageCircle,
      label: '微信',
      href: '#',
      color: 'hover:text-green-400'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // 模拟表单提交
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里可以添加实际的表单提交逻辑
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id={id} title="联系我" subtitle="有任何问题或合作意向，欢迎与我联系">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 联系信息 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-semibold text-apple-white mb-6">联系方式</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href={info.href}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-apple-gray-900 hover:bg-apple-gray-800 transition-colors group"
                    >
                      <div className="p-3 rounded-lg bg-apple-gray-800 group-hover:bg-apple-gray-700 transition-colors">
                        <Icon size={20} className="text-apple-blue" />
                      </div>
                      <div>
                        <div className="text-sm text-apple-gray-500">{info.label}</div>
                        <div className="text-apple-white font-medium">{info.value}</div>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-apple-white mb-6">社交媒体</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={`flex items-center space-x-3 p-4 rounded-xl bg-apple-gray-900 hover:bg-apple-gray-800 transition-colors group ${social.color}`}
                  >
                    <Icon size={20} className="text-apple-gray-400 group-hover:text-current transition-colors" />
                    <span className="text-apple-white font-medium">{social.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>

          <Card>
            <h4 className="text-lg font-semibold text-apple-white mb-4">响应时间</h4>
            <p className="text-apple-gray-400 mb-4">
              我通常会在 {profile.contact.responseTime} 回复邮件。如果是紧急事务，请通过电话或微信联系。
            </p>
            <div className="flex items-center space-x-2 text-sm text-apple-gray-500">
              <div className="w-2 h-2 bg-apple-green rounded-full"></div>
              <span>通常在线时间：周一至周五 9:00-18:00</span>
            </div>
          </Card>
        </motion.div>

        {/* 联系表单 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <h3 className="text-2xl font-semibold text-apple-white mb-6">发送消息</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-apple-gray-300 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-apple-gray-900 border border-apple-gray-800 rounded-lg text-apple-white placeholder-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                    placeholder="请输入您的姓名"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-apple-gray-300 mb-2">
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-apple-gray-900 border border-apple-gray-800 rounded-lg text-apple-white placeholder-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                    placeholder="请输入您的邮箱"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-apple-gray-300 mb-2">
                  主题 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-apple-gray-900 border border-apple-gray-800 rounded-lg text-apple-white placeholder-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                  placeholder="请输入消息主题"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-apple-gray-300 mb-2">
                  消息 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-apple-gray-900 border border-apple-gray-800 rounded-lg text-apple-white placeholder-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all resize-none"
                  placeholder="请输入您想说的话..."
                />
              </div>
              
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-apple-green/20 border border-apple-green/30 rounded-lg text-apple-green"
                >
                  消息发送成功！我会尽快回复您。
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-apple-red/20 border border-apple-red/30 rounded-lg text-apple-red"
                >
                  发送失败，请稍后重试。
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-apple-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>发送中...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>发送消息</span>
                  </>
                )}
              </motion.button>
            </form>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}