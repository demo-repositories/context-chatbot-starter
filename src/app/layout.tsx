import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sanity Context chatbot starter',
  description: 'A static site with a chatbot that answers from your Sanity content.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
