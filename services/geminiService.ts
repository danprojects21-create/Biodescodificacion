import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

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
      return "Hubo un error de conexión.";
    }
  },

  async generateTTS(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  },

  // Añadimos estas funciones para que CreativeTools no de error
  async generateSymbolicImage(prompt: string) {
    console.log("Generando imagen para:", prompt);
    return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"; 
  },

  async generateMeditativeVideo(prompt: string) {
    console.log("Generando video para:", prompt);
    return "https://www.w3schools.com/html/mov_bbb.mp4";
  }
};
