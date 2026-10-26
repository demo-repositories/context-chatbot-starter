// This script does a connection test on the Sanity Context MCP endpoint.
// It shows a list of the tools that the endpoint supplies.
// Usage:  npm run check:mcp
// The script reads its values from .env.local.
import { readFileSync } from 'node:fs';

try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  /* If .env.local does not exist, use the values in the environment. */
}

const url = process.env.SANITY_CONTEXT_MCP_URL;
const token = process.env.SANITY_API_READ_TOKEN;
if (!url || !token) {
  console.error('Set SANITY_CONTEXT_MCP_URL and SANITY_API_READ_TOKEN first.');
  process.exit(1);
}

const res = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  },
  body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 1 }),
});

console.log(`${res.status} ${res.statusText}`);
const text = await res.text();
try {
  const json = JSON.parse(text);
  const tools = json.result?.tools ?? [];
  console.log(tools.length ? 'Tools:' : 'No tools returned. Response:');
  for (const t of tools) console.log(`  - ${t.name}: ${t.description?.split('\n')[0] ?? ''}`);
  if (!tools.length) console.log(text);
} catch {
  console.log(text);
}
