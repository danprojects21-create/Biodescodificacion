import { GoogleGenerativeAI } from "@google/generative-ai";

// @ts-ignore
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const gemini = {
  async chat(message: string, history: any[] = []) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: (history || []).map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.text || h) }],
        })),
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      return "Lo siento, hubo un error de conexión.";
    }
  },

  async generateTTS(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  },

  // Funciones temporales para evitar errores de compilación
  async generateSymbolicImage(p: string) { return ""; },
  async generateMeditativeVideo(p: string) { return ""; }
};
