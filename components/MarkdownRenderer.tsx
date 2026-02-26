'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import 'highlight.js/styles/atom-one-dark.css'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none 
      prose-headings:text-gray-100 
      prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:border-b prose-h1:border-[#282d35] prose-h1:pb-3
      prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-gray-200
      prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-300
      prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
      prose-strong:text-gray-200 prose-strong:font-semibold
      prose-ul:text-gray-400 prose-ul:my-4 prose-ul:list-disc
      prose-ol:text-gray-400 prose-ol:my-4
      prose-li:mb-2 prose-li:text-gray-400
      prose-code:text-[#9bff00] prose-code:bg-[#0a0f14] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
      prose-pre:bg-[#0a0f14] prose-pre:border prose-pre:border-[#282d35] prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
      prose-blockquote:border-l-4 prose-blockquote:border-[#9bff00] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
      prose-hr:border-[#282d35] prose-hr:my-8
      prose-a:text-[#9bff00] prose-a:no-underline hover:prose-a:underline
      prose-table:text-gray-400 prose-th:text-gray-200 prose-td:border-[#282d35]">
      <ReactMarkdown 
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        skipHtml={true}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
