// Service for communicating with the Ventidy Python AI Chatbot Backend

const AI_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api';

/**
 * Check if the Python AI backend server is running and healthy
 */
export async function checkAiHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${AI_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { online: false, error: `Server status: ${response.status}` };
    }

    const data = await response.json();
    return { online: true, ...data };
  } catch (error) {
    return {
      online: false,
      error: error.name === 'AbortError' ? 'Timeout reaching AI server' : 'AI backend server is offline',
    };
  }
}

/**
 * Send a user message to the Python AI RAG backend
 * @param {string} message - User query
 * @param {Array} history - Previous conversation history
 * @returns {Promise<{reply: string, category?: string, success: boolean, error?: string}>}
 */
export async function sendChatMessage(message, history = []) {
  try {
    const controller = new AbortController();
    // 30 seconds timeout for AI generation
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${AI_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      reply: data.reply || "I don't have that information.",
      category: data.category || "general",
      document: data.document || null,
    };
  } catch (error) {
    console.error('Error sending message to Ventidy AI:', error);

    let userFriendlyError = "I'm sorry, I couldn't reach the Ventidy AI server. Please make sure the Python AI backend is running on port 8000.";

    if (error.name === 'AbortError') {
      userFriendlyError = "The request timed out while waiting for AI generation. Please try again.";
    }

    return {
      success: false,
      reply: userFriendlyError,
      error: error.message,
    };
  }
}

export default {
  checkAiHealth,
  sendChatMessage,
};
