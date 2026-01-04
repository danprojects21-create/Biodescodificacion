import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Usamos la variable de entorno que ya tienes configurada en Vercel
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      // Usamos el modelo real y estable para evitar errores de conexión
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      // ESTO ELIMINA EL BLOQUEO DE SEGURIDAD PARA BIODESCODIFICACIÓN
      const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ];

      const chatSession = model.startChat({
        history: history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text || "" }],
        })),
        safetySettings,
      });

      const result = await chatSession.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Error en Gemini:", error);
      return "Hubo un error de conexión con el acompañante. Por favor, intenta de nuevo en unos segundos.";
    }
  }

  // Función de voz simplificada que usa el navegador directamente
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
