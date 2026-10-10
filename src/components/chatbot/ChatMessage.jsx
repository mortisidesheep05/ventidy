export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <div
      className={`flex flex-col ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`
          max-w-[85%]
          rounded-2xl
          px-4
          py-2.5
          text-sm
          leading-relaxed
          whitespace-pre-line
          shadow-sm
          ${
            isUser
              ? "rounded-br-sm bg-navy-900 text-white dark:bg-white dark:text-navy-900"
              : isError
              ? "rounded-bl-sm border border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
              : "rounded-bl-sm border border-gray-100 bg-gray-100 text-gray-800 dark:border-navy-700/50 dark:bg-navy-800 dark:text-gray-100"
          }
        `}
      >
        {message.content}
      </div>

      {message.time && (
        <span className="mt-1 px-1 text-[10px] text-gray-400 dark:text-gray-500">
          {message.time}
        </span>
      )}
    </div>
  );
}