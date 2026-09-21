import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatbotInput from "./ChatbotInput";
import { X, Bot, RotateCcw } from "lucide-react";

export default function ChatbotWindow({
  messages,
  input,
  setInput,
  onSend,
  onClose,
  onReset,
  isTyping,
  serverOnline,
  onSelectSuggestion,
}) {
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What services do you provide?",
    "Where is Ventidy located?",
    "What are your business hours?",
    "How can I contact Ventidy?",
    "How many technicians do you have?",
  ];

  // Auto-scroll to bottom on new messages or typing state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      className="
        chatbot-window
        fixed
        bottom-24
        right-5
        z-50
        flex
        h-[520px]
        w-[380px]
        max-w-[calc(100vw-30px)]
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-2xl
        dark:border-navy-700
        dark:bg-navy-950
        transition-all
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          bg-navy-900
          px-4
          py-3
          text-white
          dark:bg-white
          dark:text-navy-900
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/10
              dark:bg-navy-900/10
            "
          >
            <Bot size={20} />
            {/* Status indicator dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-navy-900 dark:border-white ${
                serverOnline ? "bg-emerald-400" : "bg-amber-400"
              }`}
              title={serverOnline ? "AI Server Connected" : "AI Server Connecting..."}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Ventidy AI</h3>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  serverOnline
                    ? "bg-emerald-500/20 text-emerald-300 dark:bg-emerald-600/20 dark:text-emerald-700"
                    : "bg-amber-500/20 text-amber-300 dark:bg-amber-600/20 dark:text-amber-700"
                }`}
              >
                {serverOnline ? "Online" : "Connecting..."}
              </span>
            </div>

            <p className="text-xs opacity-70">
              Commercial Duct & Maintenance AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onReset && (
            <button
              onClick={onReset}
              title="Reset Conversation"
              className="
                rounded-full
                p-1.5
                text-white/80
                transition
                hover:bg-white/10
                hover:text-white
                dark:text-navy-900/80
                dark:hover:bg-navy-900/10
                dark:hover:text-navy-900
              "
            >
              <RotateCcw size={16} />
            </button>
          )}

          <button
            onClick={onClose}
            aria-label="Close chatbot"
            className="
              rounded-full
              p-1.5
              transition
              hover:bg-white/10
              dark:hover:bg-navy-900/10
            "
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="
          flex-1
          space-y-3
          overflow-y-auto
          bg-gray-50/50
          p-4
          dark:bg-navy-950
        "
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs py-1">
            <div className="flex items-center gap-1 bg-gray-200 dark:bg-navy-800 rounded-full px-3 py-1.5">
              <span className="h-1.5 w-1.5 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce"></span>
            </div>
            <span className="text-[11px] font-medium">Ventidy AI is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length <= 2 && !isTyping && (
        <div className="border-t border-gray-100 dark:border-navy-800 bg-white dark:bg-navy-900 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
            Suggested questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion && onSelectSuggestion(suggestion)}
                className="
                  text-[11px]
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-2.5
                  py-1
                  text-gray-700
                  transition
                  hover:bg-navy-900
                  hover:text-white
                  hover:border-navy-900
                  dark:border-navy-700
                  dark:bg-navy-800
                  dark:text-gray-200
                  dark:hover:bg-white
                  dark:hover:text-navy-900
                "
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <ChatbotInput
        input={input}
        setInput={setInput}
        onSend={onSend}
        disabled={isTyping}
      />
    </div>
  );
}