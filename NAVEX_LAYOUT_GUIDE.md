# NAVEX Demo Page Layout

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║                                                       ║ │
│  ║         NAVEX Regional Data Report (iframe)          ║ │
│  ║   https://www.navex.com/en-gb/northstar/...          ║ │
│  ║                                                       ║ │
│  ║   Full-bleed iframe showing the real NAVEX page      ║ │
│  ║   with all their branding, charts, and content       ║ │
│  ║                                                       ║ │
│  ║                                                       ║ │
│  ║                                                       ║ │
│  ║                                                       ║ │
│  ║                                                       ║ │
│  ║                            ┌────────────────────────┐ ║ │
│  ║                            │ ╔════════════════════╗ │ ║ │
│  ║                            │ ║ NAVEX Assistant    ║ │ ║ │
│  ║                            │ ║ Powered by Sanity  ║ │ ║ │
│  ║                            │ ╚════════════════════╝ │ ║ │
│  ║                            │                        │ ║ │
│  ║                            │ Hi, want help          │ ║ │
│  ║                            │ understanding this     │ ║ │
│  ║                            │ report? Ask me...      │ ║ │
│  ║                            │                        │ ║ │
│  ║                            │ [Give me a TLDR]       │ ║ │
│  ║                            │ [How does Europe...]   │ ║ │
│  ║                            │ [How did NAVEX...]     │ ║ │
│  ║                            └────────────────────────┘ ║ │
│  ╚═══════════════════════════════════════════════════════╝ │
│                                                    Chat Card │
│                                            slides in after   │
│                                                  2 seconds   │
└─────────────────────────────────────────────────────────────┘
                     Browser Window
```

## Chat Card States

### 1. Initial State (slides in after 2 seconds)
```
┌──────────────────────────────────┐
│ ╔══════════════════════════════╗ │
│ ║ NAVEX Assistant      [▼]    ║ │  ← Navy blue (#003057) header
│ ║ Powered by Sanity Context   ║ │
│ ╚══════════════════════════════╝ │
│                                  │
│ Hi, want help understanding      │
│ this report? Ask me anything     │
│ about NAVEX's 2026 regional      │
│ whistleblowing data.             │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Give me a TLDR               │ │  ← Suggested prompt buttons
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ How does Europe compare to   │ │
│ │ North America?               │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ How did NAVEX help NHS       │ │
│ │ Supply Chain?                │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
     380px wide × auto height
```

### 2. Expanded State (after user clicks prompt or types)
```
┌──────────────────────────────────┐
│ ╔══════════════════════════════╗ │
│ ║ NAVEX Assistant      [▼]    ║ │  ← Can minimize with [▼]
│ ║ Powered by Sanity Context   ║ │
│ ╚══════════════════════════════╝ │
│                                  │
│  User: Give me a TLDR            │  ← User messages (dark bg)
│                                  │
│                                  │
│  Assistant: Based on the         │  ← Assistant messages (light bg)
│  regional whistleblowing data,   │     with markdown & citations
│  key findings show...            │
│  - Europe: [citation link]       │
│  - North America: ...            │
│                                  │
│ ╔════════════════════════════════╗ │  ← Demo CTA after interaction
│ ║ Want to learn more?            ║ │
│ ║                                ║ │
│ ║  [Request a Demo] ───────────→ ║ │
│ ╚════════════════════════════════╝ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Type your question...        │ │  ← Input field
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
     400px wide × 600px tall
```

### 3. Loading State
```
│ User: How does Europe compare    │
│                                  │
│  ● ● ●  ← Animated loading dots │
```

## Color Scheme

**NAVEX Branding:**
- Primary: Navy Blue `#003057` (header background, buttons)
- Light: `#003057` with opacity for borders and backgrounds
- Text: White on navy, neutral-700/900 on light backgrounds
- Accent: Hover states use `#004578` (lighter navy)

**Layout:**
- Border radius: `rounded-2xl` (16px) for card
- Border radius: `rounded-lg` (8px) for buttons and prompts
- Shadow: `shadow-2xl` for depth
- Transitions: 500ms for slide-in, 300ms for expand/collapse

## Responsive Behavior

- Fixed positioning: `bottom-6 right-6` (24px from edges)
- Max width: `calc(100vw - 3rem)` (fits on smaller screens)
- Card slides in with `translate-y` and `opacity` transition
- Iframe: 100% viewport width and height
- Chat overlays iframe with `z-50`

## Animation Timeline

```
Page Load
    ↓
    0s ─────────────────► Iframe loads and displays
    │
    │  (user sees NAVEX page)
    │
    2s ─────────────────► Chat card slides in
    │                     (opacity: 0→1, translateY: 8→0)
    │
    │  (user can now interact)
    │
User Click ─────────────► Card expands to full height
    │                     (instant expand, 300ms transition)
    │
    │  (conversation begins)
    │
After 2+ messages ──────► "Request a Demo" CTA appears
                          (shown after meaningful interaction)
```

## Key Implementation Details

1. **Iframe**: Direct embedding works - no frame-blocking headers
2. **Chat Card**: Not a modal/popup - it's a floating card
3. **Positioning**: Fixed bottom-right, anchored to viewport
4. **Interaction**: Click prompts OR type custom questions
5. **Markdown**: Full support for lists, links, code blocks
6. **Citations**: Inherited from base chat component
7. **Error Handling**: Shows friendly error message if API fails

## File Locations

- Page: `src/app/navex/page.tsx`
- Demo Container: `src/components/navex/navex-demo.tsx`
- Chat Card: `src/components/navex/navex-chat.tsx`
- API Route: `src/app/api/chat/navex/route.ts`

## Testing the Layout

1. Visit: http://localhost:3000/navex
2. Observe: NAVEX iframe loads immediately
3. Wait: 2 seconds for chat card to slide in
4. Interact: Click a suggested prompt
5. Verify: Card expands, shows conversation
6. Check: Markdown formatting works
7. Confirm: "Request a Demo" CTA appears after response
