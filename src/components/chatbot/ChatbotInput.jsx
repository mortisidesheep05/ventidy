import { Send, Loader2 } from "lucide-react";

export default function ChatbotInput({
  input,
  setInput,
  onSend,
  disabled = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim() || disabled) return;

    onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        items-center
        gap-2
        border-t
        border-gray-200
        p-3
        dark:border-navy-700
      "
    >
      <input
        type="text"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        placeholder={disabled ? "Ventidy AI is responding..." : "Ask something..."}
        className="
          min-w-0
          flex-1
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          px-3
          py-2.5
          text-sm
          text-gray-900
          outline-none
          transition
          focus:border-navy-900
          disabled:opacity-60
          disabled:cursor-not-allowed
          dark:border-navy-700
          dark:bg-navy-800
          dark:text-white
        "
      />

      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-navy-900
          text-white
          transition
          hover:opacity-90
          disabled:opacity-50
          disabled:cursor-not-allowed
          dark:bg-white
          dark:text-navy-900
        "
      >
        {disabled ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </button>
    </form>
  );
}