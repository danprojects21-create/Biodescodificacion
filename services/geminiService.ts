import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    // CAMBIO CLAVE: Usamos import.meta.env para Vite
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      const model = this.ai.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Más rápido para respuestas inmediatas
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      // Corregimos el mapeo del historial para evitar el error de "conectando"
      const chatSession = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: typeof h.parts === 'string' ? h.parts : h.parts[0].text }]
        }))
      });

     const result = await chatSession.sendMessage(message);
      // CAMBIO AQUÍ: Agregamos .text() para extraer solo el mensaje
      return result.response.text(); 
    } catch (error) {
    }
  }
}

export const gemini = new GeminiService();
