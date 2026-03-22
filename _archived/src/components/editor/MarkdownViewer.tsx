'use client'

import ReactMarkdown from 'react-markdown'

interface MarkdownViewerProps {
  content: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:text-primary">
      <ReactMarkdown
        components={{
          // Code blocks
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !className

            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <div className="group relative my-4 overflow-hidden rounded-lg border border-border">
                {match && (
                  <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                    <span>{match[1]}</span>
                  </div>
                )}
                <pre className="overflow-x-auto bg-muted/30 p-4">
                  <code className="text-sm font-mono" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            )
          },

          // Headings
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 text-2xl font-bold first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-medium">{children}</h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="my-2 list-disc pl-6 marker:text-muted-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 list-decimal pl-6 marker:text-muted-foreground">{children}</ol>
          ),
          li: ({ children }) => <li className="my-1">{children}</li>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">{children}</td>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline decoration-primary/50 underline-offset-2 hover:decoration-primary"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => <hr className="my-8 border-border" />,

          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="my-4 max-w-full rounded-lg border border-border"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
