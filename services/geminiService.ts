
import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private getAI() {
    // Always use process.env.API_KEY directly for initialization
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chat(message: string, history: any[] = []) {
    const ai = this.getAI();
    // Using gemini-3-pro-preview for complex reasoning and search grounding
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Thinking budget is appropriate for Gemini 3 series models
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }]
      },
    });
    return response;
  }

  async generateSymbolicImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K") {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A symbolic, artistic representation of: ${prompt}. Minimalist, healing, professional, conceptual art style.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any
        }
      },
    });

    // Correctly iterate through parts to find the image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  }

  async generateMeditativeVideo(prompt: string, ratio: "16:9" | "9:16" = "16:9") {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic meditative video of ${prompt}. Slow movement, calm, high quality.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: ratio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key when fetching MP4 bytes from download link as per guidelines
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async generateTTS(text: string, voiceName: string = 'Zephyr') {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lee pausadamente y con calidez: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }
}

export const gemini = new GeminiService();
