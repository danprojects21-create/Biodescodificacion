import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    // Usamos el formato de Vite para leer tu variable VITE_GEMINI_API_KEY
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string) {
    try {
      // Usamos gemini-1.5-flash: es el más estable para apps web rápidas
      const model = this.ai.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      });

      // Enviamos la instrucción de biodescodificación junto con el síntoma
      const prompt = `${SYSTEM_INSTRUCTION}\n\nAnaliza el siguiente síntoma: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Retornamos solo el texto para que aparezca en la burbuja de chat
      return response.text();
      
    } catch (error) {
      console.error("Error en la conexión con la IA:", error);
      return "Lo siento, tuve un problema al conectar. Por favor, verifica tu conexión o intenta de nuevo.";
    }
  }
}

export const gemini = new GeminiService();
