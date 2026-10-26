import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { getModel } from '@/lib/provider';
import { connectToSanityContext } from '@/lib/sanity-context';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';

// Increase the time limit for responses on Vercel. The model can make many tool calls.
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 1. Connect to Sanity Context MCP and get its tools.   ← refer to src/lib/sanity-context.ts
  const { client: mcp, tools } = await connectToSanityContext();

  try {
    // 2. Stream a response from the configured LLM.          ← refer to src/lib/provider.ts
    const result = streamText({
      model: getModel(),
      instructions: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools,
      // The model can call tools a maximum of 20 times. Then, it must give an answer.
      stopWhen: isStepCount(20),
      onEnd: async () => {
        await mcp.close();
      },
      onError: async ({ error }) => {
        console.error('[chat] stream error', error);
        await mcp.close();
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    await mcp.close();
    throw error;
  }
}
