import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });

      // DESACTIVACIÓN TOTAL DE FILTROS (Igual que en tu programa original)
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ];

      const chatSession = model.startChat({
        history: history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text || "" }],
        })),
        safetySettings,
      });

      // Enviamos la instrucción como parte del contexto para evitar bloqueos de sistema
      const fullPrompt = `INSTRUCCIÓN: ${SYSTEM_INSTRUCTION}\n\nUSUARIO: ${message}`;
      
      const result = await chatSession.sendMessage(fullPrompt);
      return result.response.text();
    } catch (error) {
      console.error("Error:", error);
      return "Lo siento, el sistema de seguridad de Google detectó un término sensible. Por favor, intenta describir cómo te sientes en lugar de solo nombrar la enfermedad.";
    }
  }

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
