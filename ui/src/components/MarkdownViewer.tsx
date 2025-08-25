import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownViewerProps {
  content: string
  className?: string
}

const MarkdownViewer = ({ content, className = '' }: MarkdownViewerProps) => {
  return (
    <motion.div
      className={`prose prose-invert prose-lg max-w-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading components
          h1: ({ children, ...props }) => (
            <motion.h1
              className="text-3xl font-bold text-white mb-6 border-b border-primary-500/30 pb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              {...props}
            >
              {children}
            </motion.h1>
          ),
          h2: ({ children, ...props }) => (
            <motion.h2
              className="text-2xl font-semibold text-primary-300 mt-8 mb-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              {...props}
            >
              {children}
            </motion.h2>
          ),
          h3: ({ children, ...props }) => (
            <motion.h3
              className="text-xl font-medium text-accent-300 mt-6 mb-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              {...props}
            >
              {children}
            </motion.h3>
          ),
          
          // Custom paragraph component
          p: ({ children, ...props }) => (
            <motion.p
              className="text-secondary-200 leading-relaxed mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              {...props}
            >
              {children}
            </motion.p>
          ),
          
          // Custom list components
          ul: ({ children, ...props }) => (
            <motion.ul
              className="list-disc list-inside space-y-2 mb-4 text-secondary-200"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              {...props}
            >
              {children}
            </motion.ul>
          ),
          ol: ({ children, ...props }) => (
            <motion.ol
              className="list-decimal list-inside space-y-2 mb-4 text-secondary-200"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              {...props}
            >
              {children}
            </motion.ol>
          ),
          li: ({ children, ...props }) => (
            <motion.li
              className="mb-1 hover:text-white transition-colors duration-200"
              whileHover={{ x: 5 }}
              {...props}
            >
              {children}
            </motion.li>
          ),
          
          // Custom blockquote component
          blockquote: ({ children, ...props }) => (
            <motion.blockquote
              className="border-l-4 border-primary-500 bg-primary-500/10 pl-6 py-4 my-6 italic text-primary-200 rounded-r-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              {...props}
            >
              {children}
            </motion.blockquote>
          ),
          
          // Custom code components
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            
            if (!inline && match) {
              return (
                <motion.div
                  className="my-6 rounded-xl overflow-hidden"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '12px',
                      fontSize: '14px',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </motion.div>
              )
            }
            
            return (
              <code
                className="bg-secondary-800/50 text-primary-300 px-2 py-1 rounded-md text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          },
          
          // Custom table components
          table: ({ children, ...props }) => (
            <motion.div
              className="overflow-x-auto my-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <table className="min-w-full divide-y divide-secondary-700" {...props}>
                {children}
              </table>
            </motion.div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-secondary-800/50" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-secondary-200"
              {...props}
            >
              {children}
            </td>
          ),
          
          // Custom strong component
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-white" {...props}>
              {children}
            </strong>
          ),
          
          // Custom em component
          em: ({ children, ...props }) => (
            <em className="italic text-primary-300" {...props}>
              {children}
            </em>
          ),
          
          // Custom link component
          a: ({ children, href, ...props }) => (
            <motion.a
              href={href}
              className="text-primary-400 hover:text-primary-300 underline transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </motion.a>
          ),
          
          // Custom horizontal rule
          hr: ({ ...props }) => (
            <motion.hr
              className="border-secondary-700 my-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  )
}

export default MarkdownViewer
