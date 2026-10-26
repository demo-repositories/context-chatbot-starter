'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatInput } from './chat-input';
import { Message } from './message';

// This function returns true until the first visible text of the reply arrives.
// This includes the time when the model calls the Sanity tools.
function isWaitingForText(messages: UIMessage[]): boolean {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'assistant') return true;
  const parts = last.parts ?? [];
  const lastPart = parts[parts.length - 1];
  return !(lastPart && lastPart.type === 'text' && lastPart.text.trim().length > 0);
}

interface ChatProps {
  onClose: () => void;
  api?: string;
  title?: string;
  welcomeMessage?: string;
  welcomeSubtext?: string;
}

/** The chat panel. It sends messages to the API route and shows the replies. */
export function Chat({
  onClose,
  api = '/api/chat',
  title = 'Assistant',
  welcomeMessage = 'Hi! How can I help?',
  welcomeSubtext = 'Ask me anything about this site.',
}: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api }), [api]);
  const { messages, sendMessage, status, error } = useChat({ transport });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const isLoading = status === 'submitted' || status === 'streaming';
  const showLoader = isLoading && isWaitingForText(messages);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-900 px-4 py-3">
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="text-xs text-neutral-400">Powered by your Sanity content</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-neutral-400">
            <div>
              <p className="mb-2">{welcomeMessage}</p>
              <p className="text-xs">{welcomeSubtext}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}
            {showLoader && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-3">
                  {[0, 0.2, 0.4].map((delay) => (
                    <div
                      key={delay}
                      className="h-2 w-2 animate-pulse rounded-full bg-neutral-400"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                Something went wrong. Check the server logs and your .env.local values.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 p-4">
        <ChatInput input={input} setInput={setInput} onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  );
}
