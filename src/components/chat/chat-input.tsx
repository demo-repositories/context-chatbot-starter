interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  placeholder?: string;
}

/** The text field and the Send button for the chat. */
export function ChatInput({
  input,
  setInput,
  onSubmit,
  disabled,
  placeholder = 'Ask a question…',
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
