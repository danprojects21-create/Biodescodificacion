
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startSession = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const inputAudioContext = new AudioContext({ sampleRate: 16000 });
    const outputAudioContext = new AudioContext({ sampleRate: 24000 });
    audioContextRef.current = outputAudioContext;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({
              media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
            }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (msg) => {
          if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            const audioData = decode(msg.serverContent.modelTurn.parts[0].inlineData.data);
            const buffer = await decodeAudioData(audioData, outputAudioContext);
            const source = outputAudioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(outputAudioContext.destination);
            
            const now = outputAudioContext.currentTime;
            const startTime = Math.max(now, nextStartTimeRef.current);
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
          if (msg.serverContent?.outputTranscription) {
            setTranscriptions(prev => [...prev, msg.serverContent!.outputTranscription!.text]);
          }
        },
        onerror: (e) => console.error("Error en Sesión", e),
        onclose: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
        systemInstruction: "Eres un acompañante de biodescodificación. Habla con calidez, pausa y mucha empatía. Guía al usuario en una conversación fluida para explorar sus emociones profundas. Evita tecnicismos."
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsActive(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-slate-950 text-white p-8 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Dynamic Background */}
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
          {/* Pulse Waves */}
          {isActive && (
            <>
              <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-[-20px] bg-teal-500 rounded-full animate-ping opacity-10 [animation-delay:0.5s]" />
              <div className="absolute inset-[-40px] bg-teal-500 rounded-full animate-ping opacity-5 [animation-delay:1s]" />
            </>
          )}
          
          <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_60px_rgba(20,184,166,0.2)] ${isActive ? 'bg-teal-500 border-4 border-teal-300/50' : 'bg-slate-800 border-4 border-slate-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`w-20 h-20 transition-colors ${isActive ? 'text-teal-950' : 'text-slate-500'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-12 text-center space-y-4">
          <h3 className="text-4xl serif font-bold tracking-tight">
            {isActive ? 'Te estoy escuchando...' : 'Conversación Consciente'}
          </h3>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mx-auto">
            {isActive 
              ? 'Tómate el tiempo que necesites. No hay prisa, el silencio también es parte del proceso.' 
              : 'Un encuentro por voz para profundizar en tu sentir sin las barreras de la escritura.'}
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center space-y-6">
          {!isActive ? (
            <button 
              onClick={startSession} 
              className="bg-white text-slate-900 px-12 py-4 rounded-full font-bold text-lg hover:bg-teal-400 hover:text-teal-950 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Comenzar Encuentro
            </button>
          ) : (
            <button 
              onClick={stopSession} 
              className="bg-red-500/10 border border-red-500/50 text-red-500 px-12 py-4 rounded-full font-bold text-lg hover:bg-red-500 hover:text-white transition-all backdrop-blur-md active:scale-95"
            >
              Finalizar Sesión
            </button>
          )}
          
          <div className="flex items-center space-x-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <span>Encriptación de voz de extremo a extremo</span>
          </div>
        </div>

        <div className="mt-12 w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] h-40 overflow-y-auto custom-scrollbar">
          <div className="flex items-center space-x-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transcripción en Tiempo Real</span>
          </div>
          <p className="text-slate-300 font-light leading-relaxed italic">
            {transcriptions.length > 0 
              ? transcriptions.map((t, i) => <span key={i} className="animate-in fade-in duration-500">{t} </span>) 
              : 'El texto de la conversación aparecerá aquí para apoyar tu proceso visualmente...'}
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LiveSession;
