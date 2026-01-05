import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Vite requiere VITE_ para las variables de entorno
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chatSession = model.startChat({
        history: history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.text }] 
        })),
      });
      const result = await chatSession.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Chat Error:", error);
      return "Hubo un ajuste de seguridad. Por favor, intenta de nuevo.";
    }
  }

  // Estas funciones vacías evitan que CreativeTools.tsx rompa el programa
  async generateSymbolicImage(prompt: string) { return ""; }
  async generateMeditativeVideo(prompt: string) { return ""; }
  
  async generateTTS(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
    return null;
  }
}

export const gemini = new GeminiService();
