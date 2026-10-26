import { ChatButton } from '@/components/chat';

/**
 * This page is an example of an existing static site. All of the content on
 * this page is plain JSX. To add the chatbot, you only add the <ChatButton />
 * at the bottom.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Starter</p>
        <h1 className="text-4xl font-semibold tracking-tight">Your static site, now with answers.</h1>
        <p className="mt-4 text-lg text-neutral-600">
          This page is a placeholder for an existing frontend. The chat bubble in the corner is
          wired to a Sanity Context MCP endpoint, so it can only answer from content you have
          chosen to expose.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-3">
        <Step n={1} title="Add an LLM key">
          Set <code>AI_PROVIDER</code> to <code>anthropic</code> or <code>openai</code> and paste the
          matching API key into <code>.env.local</code>.
        </Step>
        <Step n={2} title="Point at Sanity">
          Copy the MCP URL from your Agent Context document in Studio into{' '}
          <code>SANITY_CONTEXT_MCP_URL</code>, plus a read token.
        </Step>
        <Step n={3} title="Drop in the button">
          Import <code>ChatButton</code> and render it anywhere. That is the whole integration.
        </Step>
      </section>

      <section className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
        <h2 className="mb-2 font-medium text-neutral-900">Where the wiring lives</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>src/lib/sanity-context.ts</code> connects to the Sanity Context MCP endpoint.
          </li>
          <li>
            <code>src/lib/provider.ts</code> picks Anthropic or OpenAI from the environment.
          </li>
          <li>
            <code>src/app/api/chat/route.ts</code> streams the conversation, giving the model the
            Sanity tools.
          </li>
          <li>
            <code>src/lib/system-prompt.ts</code> is the domain prompt you will want to edit.
          </li>
        </ul>
      </section>

      <ChatButton
        title="Site assistant"
        welcomeMessage="Hi! Ask me anything about this site."
        welcomeSubtext="Answers come straight from the connected Sanity content."
      />
    </main>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
        {n}
      </div>
      <h3 className="mb-1 font-medium">{title}</h3>
      <p className="text-sm text-neutral-600 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs">
        {children}
      </p>
    </div>
  );
}
