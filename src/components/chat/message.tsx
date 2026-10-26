import { isTextUIPart, type UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: UIMessage;
}

/** One chat message. It shows the text parts as Markdown. */
export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const parts = (message.parts ?? []).filter(isTextUIPart).filter((p) => p.text.trim());

  if (parts.length === 0) return null;

  const linkClass = isUser
    ? 'underline text-white/90 hover:text-white'
    : 'underline text-blue-600 hover:text-blue-700';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] space-y-2 rounded-lg px-4 py-3 text-sm ${
          isUser ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900'
        }`}
      >
        {parts.map((part, i) => (
          <ReactMarkdown
            key={i}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {children}
                </a>
              ),
              p: ({ children }) => <p className="mb-2 whitespace-pre-wrap last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
              code: ({ children, className }) =>
                className ? (
                  <code className="block overflow-x-auto rounded bg-neutral-200 p-2 text-xs">
                    {children}
                  </code>
                ) : (
                  <code className="rounded bg-neutral-200 px-1 py-0.5 text-xs">{children}</code>
                ),
            }}
          >
            {part.text}
          </ReactMarkdown>
        ))}
      </div>
    </div>
  );
}
