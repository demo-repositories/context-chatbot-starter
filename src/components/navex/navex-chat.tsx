'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Message } from '@/components/chat/message';
import { ChatInput } from '@/components/chat/chat-input';

const DEMO_REQUEST_URL = 'https://www.navex.com/en-gb/request-a-demo/';

const SUGGESTED_PROMPTS = [
  'Give me a TLDR',
  'How does Europe compare to North America?',
  'How did NAVEX help NHS Supply Chain?',
];

function isWaitingForText(messages: UIMessage[]): boolean {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'assistant') return true;
  const parts = last.parts ?? [];
  const lastPart = parts[parts.length - 1];
  return !(lastPart && lastPart.type === 'text' && lastPart.text.trim().length > 0);
}

export function NavexChat() {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat/navex' }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!isExpanded) setIsExpanded(true);
    if (!hasInteracted) setHasInteracted(true);
    sendMessage({ text: input });
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    if (!isExpanded) setIsExpanded(true);
    if (!hasInteracted) setHasInteracted(true);
    sendMessage({ text: prompt });
  };

  const isLoading = status === 'submitted' || status === 'streaming';
  const showLoader = isLoading && isWaitingForText(messages);
  const showDemoCTA = hasInteracted && messages.length >= 2 && messages[messages.length - 1]?.role === 'assistant';

  // NAVEX brand colors: navy blue (#003057) and accent blue
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-[#003057]/20 bg-white shadow-2xl transition-all duration-300 ${
        isExpanded ? 'h-[600px] w-[400px]' : 'h-auto w-[380px]'
      } max-w-[calc(100vw-3rem)]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#003057]/10 bg-[#003057] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">NAVEX Assistant</h3>
          <p className="text-xs text-white/80">Powered by Sanity Context</p>
        </div>
        {isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Minimize chat"
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Welcome or messages */}
      {!isExpanded && messages.length === 0 ? (
        <div className="space-y-3 p-4">
          <p className="text-sm text-neutral-700">
            Hi, want help understanding this report? Ask me anything about NAVEX's 2026 regional whistleblowing data.
          </p>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="w-full rounded-lg border border-[#003057]/20 bg-[#003057]/5 px-3 py-2 text-left text-sm text-[#003057] transition-colors hover:bg-[#003057]/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-sm text-neutral-500">
                <div>
                  <p className="mb-2">Ask me about NAVEX's regional whistleblowing data</p>
                  <p className="text-xs text-neutral-400">I'll answer from the knowledge base</p>
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
                          className="h-2 w-2 animate-pulse rounded-full bg-[#003057]"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    Something went wrong. Please try again.
                  </div>
                )}
                {showDemoCTA && (
                  <div className="mt-4 rounded-lg border border-[#003057]/20 bg-[#003057]/5 p-4 text-center">
                    <p className="mb-3 text-sm text-neutral-700">Want to learn more about NAVEX?</p>
                    <a
                      href={DEMO_REQUEST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-[#003057] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#004578]"
                    >
                      Request a Demo
                    </a>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-[#003057]/10 p-4">
            <ChatInput input={input} setInput={setInput} onSubmit={handleSubmit} disabled={isLoading} />
          </div>
        </>
      )}
    </div>
  );
}
