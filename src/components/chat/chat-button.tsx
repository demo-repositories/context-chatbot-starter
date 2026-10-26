'use client';

import { useState } from 'react';
import { Chat } from './chat';

interface ChatButtonProps {
  api?: string;
  title?: string;
  welcomeMessage?: string;
  welcomeSubtext?: string;
}

/** A floating button that opens the chat. Put <ChatButton /> in a page or layout. */
export function ChatButton(props: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 h-[600px] w-[400px] max-w-[calc(100vw-3rem)]">
        <Chat onClose={() => setIsOpen(false)} {...props} />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Open chat"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-110 hover:bg-neutral-800"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>
  );
}
