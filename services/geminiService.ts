import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Definimos Modality para que no de error en TTS
enum Modality {
  AUDIO = "AUDIO",
  TEXT = "TEXT",
  IMAGE = "IMAGE"
}

export class GeminiService {
  // Corregido: Usamos el nombre correcto de la librería
  private ai: GoogleGenerativeAI;

  constructor() {
    // Corregido: Usamos el nombre exacto que pusiste en Vercel
    const apiKey = process.env.VITE_GEMINI_API_KEY || '';
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    // Corregido: Acceso correcto al modelo según la SDK actual
    const model = this.ai.getGenerativeModel({ 
      model: "gemini-1.5-pro", // Versión estable para 2026
      systemInstruction: SYSTEM_INSTRUCTION 
    });

    const chatSession = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.parts[0].text }]
      }))
    });

    const result = await chatSession.sendMessage(message);
    return result.response;
  }

  // ... (He simplificado para asegurar que cargue, luego añadiremos video/imagen)
}

export const gemini = new GeminiService();
