import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Usamos VITE_GEMINI_API_KEY porque es la que tienes configurada en Vercel
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      // Usamos gemini-1.5-flash: es rápido, estable y soporta instrucciones del sistema
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      // Configuración de seguridad para evitar bloqueos en temas de salud/biodescodificación
      const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ];

      const chatSession = model.startChat({
        history: history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text || h.parts[0].text }],
        })),
        safetySettings,
      });

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error en Gemini Chat:", error);
      throw error;
    }
  }

  // Simplificamos TTS para usar la versión compatible actual
  async generateTTS(text: string) {
    try {
      // Nota: El modelo de audio directo via SDK es limitado. 
      // Si esto falla, te recomendaré usar la Web Speech API del navegador.
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([`Lee este texto con voz cálida: ${text}`]);
      return null; // El SDK estándar de texto no devuelve audio base64 directamente de esta forma.
    } catch (e) {
      return null;
    }
  }

  // Los métodos de imagen y video requieren acceso a modelos específicos (Imagen/Veo)
  // Por ahora, mantengamos el chat funcional para que tu app cobre vida.
}

export const gemini = new GeminiService();
