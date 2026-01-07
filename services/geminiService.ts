import { GoogleGenerativeAI } from "@google/generative-ai";

// Usamos import.meta.env que es lo correcto para Vite y evita el error de 'process'
// @ts-ignore
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const gemini = {
  async chat(message: string, history: any[] = []) {
    try {
      if (!API_KEY) return "Error: No has configurado la clave API en Vercel.";
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: (history || []).map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.text || h) }],
        })),
      });
      
      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      
      // Llamamos a la voz automáticamente
      this.generateTTS(responseText);
      
      return responseText;
    } catch (error) {
      console.error("Error de Gemini:", error);
      return "Hubo un error de conexión. Revisa que tu clave API sea correcta en Vercel.";
    }
  },

  async generateTTS(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // Voz en español
      window.speechSynthesis.speak(utterance);
    }
  },

  // Funciones de relleno para que otros componentes no den error
  async generateSymbolicImage(p: string) { return ""; },
  async generateMeditativeVideo(p: string) { return ""; }
};
