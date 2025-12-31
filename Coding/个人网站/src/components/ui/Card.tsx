import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function AccordionItem({ title, isExpanded, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border-b border-apple-gray-800 last:border-b-0">
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-apple-gray-900/50 transition-colors"
        whileHover={{ backgroundColor: 'rgba(26, 26, 26, 0.5)' }}
      >
        <span className="text-lg font-medium text-apple-white">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-apple-gray-500" />
        </motion.div>
      </motion.button>
      
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-apple-gray-900 rounded-xl border border-apple-gray-800 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}