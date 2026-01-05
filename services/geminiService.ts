import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const gemini = {
  async chat(message: string, history: any[] = []) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        // Ajuste para evitar bloqueos por términos sensibles
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ]
      });

      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Error en Gemini:", error);
      return "Para profundizar en este síntoma, intenta describirlo desde la emoción que sientes en el cuerpo.";
    }
  },

  async generateTTS(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.split(/VERSIÓN PARA VOZ/i)[0]);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    return null;
  }
};
