# Sanity Context chatbot starter

A deliberately small Next.js app that shows how to add a chatbot to an existing static
frontend and hook it up to a **Sanity Context MCP endpoint**, so the model answers from
your content rather than from thin air.

It uses the Vercel AI SDK v7, so the LLM provider is a one-line swap between **Anthropic**
and **OpenAI**. Bring your own key. Requires Node.js 22 or newer.

```
Browser  ──▶  /api/chat  ──▶  LLM (Anthropic or OpenAI)
                 │                 │  tool calls
                 └────────────────▶│
                                   ▼
                     Sanity Context MCP endpoint
            https://api.sanity.io/<v>/agent-context/<project>/<dataset>/<slug>
```

## 1. Set up Sanity (once)

1. In your Studio, install the plugin and add it to `sanity.config.ts`:

   ```bash
   npm install @sanity/agent-context
   ```

   ```ts
   import { agentContextPlugin } from '@sanity/agent-context/studio';

   export default defineConfig({
     // ...
     plugins: [structureTool(), agentContextPlugin()],
   });
   ```

2. Open the Studio in a browser once so the schema is deployed server-side.
3. Create an **Agent Context** document. Give it a name, a slug, and a GROQ filter for the
   content the bot may see, for example `_type in ["article", "faq"]`.
4. Copy the **MCP URL** shown at the top of that document.
5. Create a read-only API token at sanity.io/manage → Project → API → Tokens.

## 2. Run this app

```bash
cp .env.example .env.local   # then fill it in
npm install
npm run check:mcp            # optional: confirms the MCP URL and token work
npm run dev
```

Open http://localhost:3000 and click the chat bubble.

### Environment variables

| Variable                  | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `AI_PROVIDER`             | `anthropic` (default) or `openai`                              |
| `ANTHROPIC_API_KEY`       | Required when `AI_PROVIDER=anthropic`                          |
| `OPENAI_API_KEY`          | Required when `AI_PROVIDER=openai`                             |
| `AI_MODEL`                | Optional model override. Defaults: `claude-opus-5` / `gpt-5`   |
| `SANITY_CONTEXT_MCP_URL`  | **The link to your knowledge base.** Copied from Studio.       |
| `SANITY_API_READ_TOKEN`   | Read-only Sanity token sent as a Bearer header to the MCP URL  |

## 3. Optional: Agent Insights

The same `@sanity/agent-context` package can record every conversation into Sanity and
classify it on a schedule (success score, sentiment, content gaps), with a dashboard in
Studio. The Studio side is on by default once the plugin is installed.

The server-side helper, `sanityInsightsIntegration` from `@sanity/agent-context/ai-sdk`,
currently declares a peer dependency on AI SDK **v6**. This starter is on v7, so that helper
is not wired in here. Once the package publishes v7 support, add it to `streamText` via
`experimental_telemetry.integrations` as shown in the package README.

## 4. Where to look

Only four files matter. Everything else is scaffolding.

| File                              | What it does                                                             |
| --------------------------------- | ------------------------------------------------------------------------ |
| `src/lib/sanity-context.ts`       | Opens an MCP client against the Sanity Context URL and fetches its tools |
| `src/lib/provider.ts`             | Returns an Anthropic or OpenAI model based on `AI_PROVIDER`              |
| `src/app/api/chat/route.ts`       | Streams the chat, handing the Sanity tools to the model                  |
| `src/lib/system-prompt.ts`        | Domain instructions. Edit this to describe your content and tone         |

The UI lives in `src/components/chat/` and is plain React + Tailwind. To add the bot to
your own site, copy that folder and the four files above, then render `<ChatButton />`.

## What the model can do

Connecting to the MCP URL gives the model these tools automatically:

- `initial_context` returns a compressed overview of your schema and document counts.
- `schema_explorer` returns the fields of one document type.
- `groq_query` runs GROQ, including semantic search via `text::embedding()`.
- `array_field_reader` pages through large array fields on a document.

The slug in the MCP URL applies the GROQ filter from the Agent Context document, so the
model never sees content outside that filter. Drop the slug to expose the whole dataset
while testing.

## Troubleshooting

- **401 from check:mcp** means the token is wrong or lacks read access.
- **No tools returned** usually means the schema has not been deployed. Open the Studio in
  a browser and retry, or run `npx sanity schema deploy` in the Studio project.
- **Empty answers** usually mean the Agent Context filter excludes the content. Widen it.
- **Model errors** usually mean the key does not match `AI_PROVIDER`, or `AI_MODEL` names a
  model that provider does not offer.

## Versions

| Package                        | Version used | Note                                              |
| ------------------------------ | ------------ | ------------------------------------------------- |
| `ai`                           | 7.x          | `instructions` replaces `system`, `isStepCount`   |
| `@ai-sdk/anthropic` / `openai` | 4.x          |                                                   |
| `@ai-sdk/mcp`                  | 2.x          | Rejects HTTP redirects by default (SSRF guard)    |
| `@ai-sdk/react`                | 4.x          |                                                   |
| `@sanity/agent-context`        | 0.6.x        | Studio plugin. Peers on `sanity` 5.x, AI SDK 6.x  |

## Adapting to another stack

The MCP connection is just an HTTP transport with a Bearer token. Any MCP-capable client
in any language can use it. The Vercel AI SDK pieces here are convenience, not a requirement.
