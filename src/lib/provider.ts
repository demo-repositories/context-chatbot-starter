import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  LLM PROVIDER — change Anthropic / OpenAI with one env var               ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * The chatbot uses the Vercel AI SDK. Thus, the provider is only a model
 * factory. To select a provider, set AI_PROVIDER to "anthropic" or "openai".
 * Then, supply the API key for that provider. Each provider package reads its
 * key from the environment automatically (ANTHROPIC_API_KEY or OPENAI_API_KEY).
 */
const DEFAULT_MODELS = {
  anthropic: 'claude-opus-5',
  openai: 'gpt-5',
} as const;

type Provider = keyof typeof DEFAULT_MODELS;

export function getModel(): LanguageModel {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic') as Provider;
  const modelId = process.env.AI_MODEL ?? DEFAULT_MODELS[provider];

  switch (provider) {
    case 'anthropic':
      if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
      return anthropic(modelId);
    case 'openai':
      if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
      return openai(modelId);
    default:
      throw new Error(`Unknown AI_PROVIDER "${provider}". Use "anthropic" or "openai".`);
  }
}
