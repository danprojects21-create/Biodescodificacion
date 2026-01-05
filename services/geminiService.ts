import { GoogleGenerativeAI } from "@google/generative-ai";

// Corregido: Uso de import.meta.env para Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const gemini = {
  async chat(message: string, history: any[] = []) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Error:", error);
      return "Lo siento, hubo un error de conexión.";
    }
  }
};
