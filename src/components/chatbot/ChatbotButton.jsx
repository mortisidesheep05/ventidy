import { MessageCircle } from "lucide-react";

export default function ChatbotButton({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      className="
        fixed
        bottom-5
        right-5
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-navy-900
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:scale-105
        dark:bg-white
        dark:text-navy-900
      "
    >
      <MessageCircle size={26} />
    </button>
  );
}