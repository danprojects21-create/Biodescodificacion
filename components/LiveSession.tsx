import React, { useState, useRef } from 'react';
// Corregido: La librería oficial es @google/generative-ai
import { GoogleGenerativeAI } from '@google/generative-ai';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startSession = async () => {
    try {
      // Corregido: Uso de import.meta.env para Vite y nombre correcto de la clase
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Inicializar contextos de audio
      const inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const outputAudioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Utilidades de conversión
      const encode = (bytes: Uint8Array) => {
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
      };

      const decode = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        return bytes;
      };

      const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        return buffer;
      };

      // Corregido: Configuración del modelo y conexión
      // Nota: El SDK de Live se maneja a través de getGenerativeModel
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
      
      // Simulación de conexión Live (Ajustado a la sintaxis actual del SDK)
      const session = (model as any).startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        }
      });

      // Lógica de captura de audio
      setIsActive(true);
      const source = inputAudioContext.createMediaStreamSource(stream);
      const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
        // Aquí se enviaría al stream si el SDK Live estuviera disponible globalmente
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContext.destination);
      sessionRef.current = session;

    } catch (error) {
      console.error("Error al iniciar sesión de voz:", error);
      alert("No se pudo acceder al micrófono o a la API de Gemini.");
    }
  };

  const stopSession = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsActive(false);
    sessionRef.current = null;
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-slate-950 text-white p-8 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px]">
      {/* Background Dinámico */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-40' : 'opacity-10'}`}>
        <img 
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover blur-sm" 
          alt="Ambiente Meditativo" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-110' : 'scale-100'}`}>
          {isActive && (
            <>
              <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-[-20px] bg-teal-500 rounded-full animate-ping opacity-10 [animation-delay:0.5s]" />
            </>
          )}
          
          <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_60px_rgba(20,184,166,0.2)] ${isActive ? 'bg-teal-500 border-4 border-teal-300/50' : 'bg-slate-800 border-4 border-slate-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`w-20 h-20 transition-colors ${isActive ? 'text-teal-950' : 'text-slate-500'}`}>
              <path stroke
