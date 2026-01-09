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
          parts: [{ text: String(h.text || "") }],
        })),
      });
      const result = await chat.sendMessage(message);
      const text = result.response.text();
      this.generateTTS(text); // Activa la voz
      return text;
    } catch (error) {
      return "Error de conexión. Revisa tu clave API.";
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

  async generateSymbolicImage(prompt: string) { return ""; },
  async generateMeditativeVideo(prompt: string) { return ""; }
};
