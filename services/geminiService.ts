import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    // Leemos la llave usando el formato de Vite para 2026
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      // Usamos el modelo flash por su rapidez en consultas de biodescodificación
      const model = this.ai.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      // Formateamos el historial para que Google lo entienda perfectamente
      const chatSession = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: typeof h.parts === 'string' ? h.parts : h.parts[0].text }]
        }))
      });

      const result = await chatSession.sendMessage(message);
      
      // Extraemos solo el texto de la respuesta para mostrarlo en pantalla
      return result.response.text(); 
      
    } catch (error) {
      console.error("Error detallado en GeminiService:", error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();
