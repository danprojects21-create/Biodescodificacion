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
      // Usamos 1.5-flash que es el estándar actual para apps rápidas
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });

      // CONFIGURACIÓN DE SEGURIDAD MÁXIMA PERMISIVIDAD (Igual al original)
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
        generationConfig: {
          maxOutputTokens: 1000,
        }
      });

      // Incluimos la instrucción del sistema aquí directamente para asegurar que se lea
      const promptConInstruccion = `${SYSTEM_INSTRUCTION}\n\nUsuario: ${message}`;
      
      const result = await chatSession.sendMessage(promptConInstruccion);
      return result.response.text();
    } catch (error) {
      console.error("Error detallado:", error);
      return "Hubo un ajuste de seguridad. Por favor, intenta con términos más simples.";
    }
  }

  async generateTTS(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Limpia audios anteriores
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
    return null;
  }
}

export const gemini = new GeminiService();
