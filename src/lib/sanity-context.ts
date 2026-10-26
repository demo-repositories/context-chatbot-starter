import { createMCPClient } from '@ai-sdk/mcp';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  SANITY CONTEXT MCP — the connection from the chatbot to your content    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Sanity supplies one MCP (Model Context Protocol) server for each Agent
 * Context document. When the chatbot connects to this server, the LLM gets
 * these tools. The chatbot finds the tools at runtime:
 *
 *   initial_context     Gives a short overview of your schema and document counts.
 *   schema_explorer     Gives all of the fields for one document type.
 *   groq_query          Runs GROQ on the dataset. It supports text::embedding().
 *   array_field_reader  Reads large array fields on a document, one page at a time.
 *
 * Studio shows the URL at the top of the Agent Context document:
 *   https://api.sanity.io/<apiVersion>/agent-context/<projectId>/<dataset>/<slug>
 *
 * The <slug> limits the agent to the GROQ filter on that document. Thus, the
 * model can only see the content that you select. If you remove the slug, the
 * model can see all of the dataset. This is satisfactory for local tests.
 * Do not do this in production.
 */
export async function connectToSanityContext() {
  const url = process.env.SANITY_CONTEXT_MCP_URL;
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!url) throw new Error('SANITY_CONTEXT_MCP_URL is not set');
  if (!token) throw new Error('SANITY_API_READ_TOKEN is not set');

  const client = await createMCPClient({
    transport: {
      type: 'http',
      url,
      headers: {
        // Use a read-only Sanity API token. The Viewer role is sufficient.
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // Get the tool definitions. Then, give them directly to the LLM.
  const tools = await client.tools();

  return { client, tools };
}
