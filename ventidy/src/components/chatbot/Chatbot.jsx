import { useState, useEffect } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";
import { sendChatMessage, checkAiHealth } from "../../services/aiService";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);

  const initialMessage = {
    role: "assistant",
    content: "Hi! 👋 I'm Ventidy AI. How can I help you today with our commercial duct cleaning and maintenance services?",
    time: "Just now",
  };

  const [messages, setMessages] = useState([initialMessage]);

  // Check AI server health when chat opens
  useEffect(() => {
    let isMounted = true;

    async function verifyHealth() {
      const health = await checkAiHealth();
      if (isMounted) {
        setServerOnline(health.online);
      }
    }

    if (isOpen) {
      verifyHealth();
      const interval = setInterval(verifyHealth, 15000); // Poll every 15s while open
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const executeSendMessage = async (textToSend) => {
    const userText = (textToSend || input).trim();
    if (!userText || isTyping) return;

    const currentTime = getTimeString();

    // Add user message to state
    const newMessages = [
      ...messages,
      {
        role: "user",
        content: userText,
        time: currentTime,
      },
    ];

    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Call Python FastAPI AI backend
      const result = await sendChatMessage(userText, newMessages);

      if (result.success) {
        setServerOnline(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.reply,
            category: result.category,
            time: getTimeString(),
          },
        ]);
      } else {
        setServerOnline(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.reply,
            isError: true,
            time: getTimeString(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An unexpected error occurred while communicating with the AI service.",
          isError: true,
          time: getTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    executeSendMessage(input);
  };

  const handleSelectSuggestion = (suggestion) => {
    executeSendMessage(suggestion);
  };

  const handleReset = () => {
    setMessages([initialMessage]);
  };

  return (
    <>
      {isOpen && (
        <ChatbotWindow
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onClose={() => setIsOpen(false)}
          onReset={handleReset}
          isTyping={isTyping}
          serverOnline={serverOnline}
          onSelectSuggestion={handleSelectSuggestion}
        />
      )}

      <ChatbotButton
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </>
  );
}