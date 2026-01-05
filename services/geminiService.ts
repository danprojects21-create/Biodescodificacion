import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Verificamos que use la variable configurada en Vercel
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(message: string, history: any[] = []) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      // ESTA ES LA LÍNEA QUE EVITA EL BLOQUEO MÉDICO
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ];

      const chatSession = model.startChat({
        history: history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }],
        })),
        safetySettings,
      });

      const result = await chatSession.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Error en conexión:", error);
      return "Hubo un ajuste de seguridad. Por favor, intenta describir el sentimiento en lugar del nombre del síntoma.";
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
