'use client';

import { useState, useEffect } from 'react';
import { NavexChat } from './navex-chat';

const NAVEX_URL = 'https://www.navex.com/en-gb/northstar/regional-data-whistleblowing-statistics/';
const SLIDE_IN_DELAY = 2000; // 2 seconds

export function NavexDemo() {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
    }, SLIDE_IN_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-bleed iframe */}
      <iframe
        src={NAVEX_URL}
        className="h-full w-full border-0"
        title="NAVEX Regional Whistleblowing Statistics"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

      {/* In-page chat card */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          showChat ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <NavexChat />
      </div>
    </div>
  );
}
