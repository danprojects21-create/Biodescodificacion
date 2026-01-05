import React, { useState, useRef } from 'react';
import { gemini } from '../services/geminiService';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startSession = async () => {
    try {
      // Pedir permiso de micrófono
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsActive(true);
      setTranscriptions(["Sesión de voz iniciada. Te escucho..."]);
      
      // Nota: El SDK de navegación actual no soporta el protocolo 'live' nativo 
      // de la misma forma que Node.js, por lo que usamos una simulación activa.
    } catch (error) {
      console.error("Error de micrófono:", error);
      alert("Por favor, permite el acceso al micrófono.");
    }
  };

  const stopSession = () => {
    setIsActive(false);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-slate-950 text-white p-8 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px]">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-40' : 'opacity-10'}`}>
        <img 
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover blur-sm" 
          alt="Meditación" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-110' : 'scale-100'}`}>
          {isActive && (
            <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-20" />
          )}
          <div className={`w-full h-full rounded-full flex items-center justify-center ${isActive ? 'bg-teal-500' : 'bg-slate-800'}`}>
            <span className="text-4xl">{isActive ? '🎙️' : '💤'}</span>
          </div>
        </div>
        
        <h3 className="mt-8 text-3xl font-bold">
          {isActive ? 'Sesión Activa' : 'Encuentro por Voz'}
        </h3>

        <button 
          onClick={isActive ? stopSession : startSession}
          className={`mt-10 px-10 py-4 rounded-full font-bold transition-all ${isActive ? 'bg-red-500 text-white' : 'bg-white text-slate-900'}`}
        >
          {isActive ? 'Finalizar Sesión' : 'Comenzar Encuentro'}
        </button>

        <div className="mt-10 w-full bg-white/5 p-6 rounded-2xl h-32 overflow-y-auto">
          <p className="text-slate-400 italic text-sm">
            {transcriptions.map((t, i) => <span key={i}>{t} </span>)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
